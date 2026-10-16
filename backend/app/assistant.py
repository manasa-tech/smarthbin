import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/assistant", tags=["SmartBin AI"])

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://localhost:11434"
)
OLLAMA_MODEL = os.getenv(
    "OLLAMA_MODEL",
    "qwen3:latest"
)

SYSTEM_PROMPT = """
You are SmartBin AI, an assistant for a smart waste management project.
Help users with waste segregation, recycling, responsible disposal,
waste collection, and keeping cities clean.
Give practical, clear answers. Do not invent live bin readings,
collection schedules, or sensor data. If unsure, say so.
"""

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def assistant_chat(request: ChatRequest):
    question = request.message.strip()

    if not question:
        raise HTTPException(
            status_code=400,
            detail="Please enter a message."
        )

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{OLLAMA_URL}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "stream": False,
                    "messages": [
                        {
                            "role": "system",
                            "content": SYSTEM_PROMPT
                        },
                        {
                            "role": "user",
                            "content": question
                        }
                    ]
                }
            )

            response.raise_for_status()
            data = response.json()

        return {
            "answer": data["message"]["content"],
            "model": OLLAMA_MODEL
        }

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Ollama is not running. Start Ollama and try again."
        )
    except httpx.HTTPStatusError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Ollama returned an error: {exc.response.text[:300]}"
        )
    except httpx.RequestError:
        raise HTTPException(
            status_code=504,
            detail="Ollama took too long to respond."
        )



