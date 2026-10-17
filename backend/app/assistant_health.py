import os
import httpx
from fastapi import APIRouter

router = APIRouter(
    prefix="/api/assistant",
    tags=["Assistant Health"]
)

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://localhost:11434"
)

OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "qwen3:latest"
)


@router.get("/health")
async def assistant_health():
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(
                f"{OLLAMA_URL}/api/tags"
            )
            response.raise_for_status()
            data = response.json()

        models = [
            item.get("name", "")
            for item in data.get("models", [])
        ]

        model_available = OLLAMA_MODEL in models

        return {
            "status": "ok",
            "ollama_connected": True,
            "configured_model": OLLAMA_MODEL,
            "model_available": model_available,
            "installed_models": models
        }

    except (httpx.HTTPError, ValueError):
        return {
            "status": "unavailable",
            "ollama_connected": False,
            "configured_model": OLLAMA_MODEL,
            "model_available": False,
            "installed_models": []
        }
