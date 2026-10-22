import os
import requests
from dotenv import load_dotenv

load_dotenv()

OLLAMA_URL = os.getenv(
    "OLLAMA_URL",
    "http://localhost:11434/api/generate"
)

OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")


def ask_ollama(prompt):
    if not isinstance(prompt, str) or not prompt.strip():
        return {
            "success": False,
            "response": "Please enter a question."
        }

    try:
        result = requests.post(
            OLLAMA_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": (
                    "You are the AI assistant for Automated Smart Bin, "
                    "a smart waste-management platform. Help users with "
                    "waste segregation, recycling, bin monitoring, and "
                    "cleanliness. Give clear, practical answers.\n\n"
                    f"User question: {prompt.strip()}"
                ),
                "stream": False
            },
            timeout=60
        )

        result.raise_for_status()
        data = result.json()
        answer = data.get("response", "").strip()

        if not answer:
            return {
                "success": False,
                "response": "The AI returned an empty response. Try again."
            }

        return {
            "success": True,
            "response": answer
        }

    except requests.exceptions.ConnectionError:
        return {
            "success": False,
            "response": (
                "Cannot connect to Ollama. Make sure Ollama is running "
                "and the selected model is installed."
            )
        }

    except requests.exceptions.Timeout:
        return {
            "success": False,
            "response": "The AI request timed out. Please try again."
        }

    except requests.exceptions.RequestException:
        return {
            "success": False,
            "response": "Unable to contact the AI service right now."
        }

    except (ValueError, TypeError):
        return {
            "success": False,
            "response": "The AI service returned an invalid response."
        }
