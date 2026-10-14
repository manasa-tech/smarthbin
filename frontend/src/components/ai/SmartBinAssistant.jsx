import React, { useState, useEffect, useRef } from "react";
import {
  Bot, X, Minus, Send, Leaf, Recycle,
  MapPin, AlertTriangle, Truck, LoaderCircle
} from "lucide-react";
import "./SmartBinAssistant.css";

const API_URL = "http://localhost:8000/api/ai/chat";

const suggestions = [
  { label: "How to separate waste?", icon: Recycle },
  { label: "Find nearby bins", icon: MapPin },
  { label: "Report overflowing bin", icon: AlertTriangle },
  { label: "Recycling guidelines", icon: Leaf },
  { label: "Next collection?", icon: Truck },
];

export default function SmartBinAssistant() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm SmartBin AI.\n\nI can help you with waste segregation, recycling, and responsible disposal.\n\nHow can I help you today?",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage(text = input) {
    const question = text.trim();
    if (!question || loading) return;

    const history = [
      ...messages,
      { role: "user", content: question },
    ];

    setMessages(history);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: question,
          history: history.slice(-10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "AI request failed.");
      }

      const reply = data.reply || data.response;

      if (!reply) throw new Error("Empty AI response.");

      setMessages((previous) => [
        ...previous,
        { role: "assistant", content: reply },
      ]);
    } catch (err) {
      setError(
        "Unable to connect to SmartBin AI. Check that FastAPI and Ollama are running."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <button
        className="sb-ai-launcher"
        onClick={() => setOpen(true)}
      >
        <Bot size={23} /> SmartBin AI
      </button>
    );
  }

  return (
    <aside className="sb-ai-panel">
      <header className="sb-ai-header">
        <div className="sb-ai-logo"><Bot size={30} /></div>

        <div className="sb-ai-heading">
          <h2><Leaf size={17} /> SmartBin AI Assistant</h2>
          <p>Your waste management guide ✨</p>
        </div>

        <button className="sb-ai-icon-btn" onClick={() => setOpen(false)} aria-label="Minimize">
          <Minus size={20} />
        </button>
        <button className="sb-ai-icon-btn" onClick={() => setOpen(false)} aria-label="Close">
          <X size={20} />
        </button>
      </header>

      <div className="sb-ai-messages">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`sb-ai-row ${message.role === "user" ? "sb-ai-user-row" : ""}`}
          >
            {message.role === "assistant" && (
              <div className="sb-ai-avatar"><Bot size={20} /></div>
            )}

            <div className="sb-ai-message-wrap">
              <div className={`sb-ai-bubble ${message.role === "user" ? "sb-ai-user-bubble" : ""}`}>
                {message.content}
              </div>
              <small className="sb-ai-time">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </small>
            </div>

            {message.role === "user" && (
              <div className="sb-ai-user-avatar">U</div>
            )}
          </div>
        ))}

        {loading && (
          <div className="sb-ai-row">
            <div className="sb-ai-avatar"><Bot size={20} /></div>
            <div className="sb-ai-bubble sb-ai-thinking">
              <LoaderCircle size={17} className="sb-ai-spinner" />
              Llama is thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <div className="sb-ai-error">{error}</div>}

      <section className="sb-ai-suggestions">
        <p>You can also ask:</p>
        <div className="sb-ai-suggestion-grid">
          {suggestions.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className="sb-ai-suggestion"
              disabled={loading}
              onClick={() => sendMessage(label)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </section>

      <form
        className="sb-ai-composer"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask SmartBin AI anything..."
          aria-label="Message SmartBin AI"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send message"
        >
          <Send size={19} />
        </button>
      </form>

      <p className="sb-ai-footer">SmartBin AI · Waste smarter, live greener</p>
    </aside>
  );
}
