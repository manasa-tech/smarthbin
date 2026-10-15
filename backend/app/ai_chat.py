import httpx
from typing import Literal

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api/ai", tags=["SmartBin AI"])

OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
MODEL_NAME = "llama3.2:3b"

SYSTEM_PROMPT = """
You are SmartBin AI, a friendly waste management assistant.
Explain wet, dry, recyclable, and hazardous waste segregation.
Give practical recycling and disposal advice in simple language.
Never invent live bin locations, sensor readings, or collection schedules.
If live data is unavailable, explain that clearly.
"""

class ChatMessage(BaseModel):
    role: Literal["user", "assistant"]
    content: str = Field(min_length=1, max_length=4000)

class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[ChatMessage] = Field(default_factory=list)

@router.post("/chat")
async def smartbin_ai_chat(request: ChatRequest):
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]

    for item in request.history[-10:]:
        messages.append({
            "role": item.role,
            "content": item.content
        })

    if (
        messages[-1]["role"] != "user"
        or messages[-1]["content"] != request.message
    ):
        messages.append({
            "role": "user",
            "content": request.message
        })

    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                OLLAMA_URL,
                json={
                    "model": MODEL_NAME,
                    "messages": messages,
                    "stream": False
                }
            )
        response.raise_for_status()
        reply = response.json().get("message", {}).get("content", "").strip()

        if not reply:
            raise HTTPException(status_code=502, detail="Empty AI response")

        return {"reply": reply}

    except httpx.ConnectError:
        raise HTTPException(
            status_code=503,
            detail="Ollama is not running. Start Ollama and retry."
        )
    except httpx.TimeoutException:
        raise HTTPException(
            status_code=504,
            detail="AI response timed out. Please retry."
        )
    except httpx.HTTPStatusError:
        raise HTTPException(
            status_code=502,
            detail="Ollama could not process the request."
        )
