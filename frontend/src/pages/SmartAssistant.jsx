import { useState } from "react";
import { Send, Bot, User, Trash2, RotateCcw } from "lucide-react";
import api from "../services/api";
import "./../style/smart-assistant.css";

const suggestions = [
  "How should I separate wet and dry waste?",
  "How can I reduce plastic waste?",
  "What should I do when a bin is full?",
  "How can I recycle household waste?",
];

export default function SmartAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your SmartBin Assistant. Ask me about waste segregation, recycling, or smart waste management.",
    },
  ]);

  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async (text = input) => {
    const question = text.trim();

    if (!question || sending) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: question },
    ]);

    setInput("");
    setError("");
    setSending(true);

    try {
      const response = await api.post("/api/assistant/chat", {
        message: question,
      });

      const answer =
        response.data?.answer ||
        response.data?.response ||
        response.data?.message ||
        "I received your question, but the server did not return an answer.";

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: answer },
      ]);
    } catch {
      setError(
        "I couldn't connect to the SmartBin Assistant backend. Please check that the backend is running and the assistant API endpoint is configured."
      );
    } finally {
      setSending(false);
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm your SmartBin Assistant. Ask me about waste segregation, recycling, or smart waste management.",
      },
    ]);
    setError("");
  };

  return (
    <div className="smart-assistant-page">
      <header className="smart-assistant-header">
        <div className="smart-assistant-title-icon">
          <Bot size={28} />
        </div>

        <div className="smart-assistant-title">
          <h1>SmartBin Assistant</h1>
          <p>Your AI guide to smarter waste management</p>
        </div>

        <button
          className="smart-assistant-reset"
          onClick={resetChat}
          title="Start a new conversation"
          aria-label="Reset conversation"
        >
          <RotateCcw size={18} />
          <span>New chat</span>
        </button>
      </header>

      <section className="smart-assistant-chat">
        <div className="smart-assistant-messages" aria-live="polite">
          {messages.map((message, index) => (
            <div
              className={`smart-assistant-message ${message.role}`}
              key={`${message.role}-${index}`}
            >
              <div className="smart-assistant-avatar">
                {message.role === "assistant" ? (
                  <Bot size={19} />
                ) : (
                  <User size={19} />
                )}
              </div>

              <div className="smart-assistant-bubble">
                <span className="smart-assistant-sender">
                  {message.role === "assistant" ? "SmartBin Assistant" : "You"}
                </span>
                <p>{message.content}</p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="smart-assistant-typing">
              <Bot size={18} />
              SmartBin Assistant is thinking...
            </div>
          )}

          {error && (
            <div className="smart-assistant-error" role="alert">
              {error}
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="smart-assistant-suggestions">
            <h3>Try asking</h3>
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => sendMessage(suggestion)}
                disabled={sending}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form
          className="smart-assistant-input-area"
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage();
          }}
        >
          <div className="smart-assistant-input-box">
            <Trash2 size={19} className="smart-assistant-input-icon" />

            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about recycling, waste segregation..."
              aria-label="Ask SmartBin Assistant"
              disabled={sending}
            />

            <button
              type="submit"
              disabled={!input.trim() || sending}
              aria-label="Send message"
            >
              <Send size={19} />
            </button>
          </div>

          <p className="smart-assistant-disclaimer">
            For general waste-management guidance. Follow local waste-disposal
            rules.
          </p>
        </form>
      </section>
    </div>
  );
}
