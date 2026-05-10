from typing import Literal

from pydantic import BaseModel


EventType = Literal[
    "session.ready",
    "session.state",
    "transcript.partial",
    "transcript.final",
    "session.completed",
]

CommandType = Literal["session.start", "demo.start", "demo.pause", "demo.reset"]


class ClientCommand(BaseModel):
    type: CommandType


class ServerEvent(BaseModel):
    type: EventType
    payload: dict
