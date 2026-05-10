import asyncio

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.models.events import ClientCommand, ServerEvent
from app.services.demo.event_replayer import DemoReplaySession

router = APIRouter()


@router.websocket("/ws/calls")
async def calls_socket(websocket: WebSocket) -> None:
    await websocket.accept()
    session = DemoReplaySession()
    stream_task: asyncio.Task | None = None

    async def send_event(event: dict) -> None:
        await websocket.send_json(event)

    await send_event(ServerEvent(type="session.ready", payload={"mode": "demo"}).model_dump())

    try:
        while True:
            raw_message = await websocket.receive_json()
            command = ClientCommand.model_validate(raw_message)

            if command.type == "session.start":
                await send_event(
                    ServerEvent(
                        type="session.state",
                        payload={"isRunning": session.is_running, "scriptIndex": session.script_index},
                    ).model_dump()
                )
                continue

            if command.type == "demo.start":
                if stream_task and not stream_task.done():
                    continue
                session.is_running = True
                await send_event(
                    ServerEvent(
                        type="session.state",
                        payload={"isRunning": True, "scriptIndex": session.script_index},
                    ).model_dump()
                )
                stream_task = asyncio.create_task(session.stream(send_event))
                continue

            if command.type == "demo.pause":
                session.pause()
                if stream_task and not stream_task.done():
                    stream_task.cancel()
                await send_event(
                    ServerEvent(
                        type="session.state",
                        payload={"isRunning": False, "scriptIndex": session.script_index},
                    ).model_dump()
                )
                continue

            if command.type == "demo.reset":
                session.reset()
                if stream_task and not stream_task.done():
                    stream_task.cancel()
                await send_event(
                    ServerEvent(
                        type="session.state",
                        payload={"isRunning": False, "scriptIndex": session.script_index},
                    ).model_dump()
                )
    except asyncio.CancelledError:
        raise
    except WebSocketDisconnect:
        if stream_task and not stream_task.done():
            stream_task.cancel()
