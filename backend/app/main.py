from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.websocket.calls import router as calls_router

app = FastAPI(title="Intercept API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(calls_router)


@app.get("/health")
async def health() -> dict[str, str]:
    return {"status": "ok", "service": "intercept-backend"}
