from flask import Blueprint, request, jsonify
from services.ollama_service import ask_ollama

assistant_bp = Blueprint(
    "assistant",
    __name__,
    url_prefix="/api/assistant"
)


@assistant_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message")

    if not isinstance(message, str) or not message.strip():
        return jsonify({
            "success": False,
            "error": "Please provide a message."
        }), 400

    result = ask_ollama(message.strip())

    if not result["success"]:
        return jsonify(result), 503

    return jsonify(result), 200


@assistant_bp.route("/health", methods=["GET"])
def assistant_health():
    return jsonify({
        "assistant": "Automated Smart Bin AI Assistant",
        "endpoint": "/api/assistant/chat",
        "method": "POST"
    })
