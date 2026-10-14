import React, { useEffect, useRef, useState } from "react";
import {
  Bot, X, Minus, Send, Leaf, Recycle,
  MapPin, AlertTriangle, Truck, LoaderCircle
} from "lucide-react";
import "./SmartBinAssistant.css";

const suggestions = [
  { text: "How to separate waste?", icon: Recycle },
  { text: "Find nearby bins", icon: MapPin },
  { text: "Report overflowing bin", icon: AlertTriangle },
  { text: "Recycling guidelines", icon: Leaf },
  { text: "When is the next collection?", icon: Truck },
];

export default function SmartBinAssistant() {
  const [open, setOpen] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm SmartBin AI. 🌱\n\nI can help you with waste segregation, recycling, and responsible disposal.\n\nHow can I help you today?",
    },
  ]);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  function sendMessage(text = input) {
    const value = text.trim();
    if (!value || loading) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", content: value },
    ]);
    setInput("");

    // Frontend preview only. Backend connection will be added later.
    setLoading(true);
    window.setTimeout(() => {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Your message is ready to be processed by SmartBin AI. 🌿 Once the FastAPI and Ollama backend is connected, Llama will generate a real answer to your question.",
        },
      ]);
      setLoading(false);
    }, 700);
  }

  if (!open) {
    return (
      <button
        className="sb-ai-launcher"
        onClick={() => setOpen(true)}
      >
        <Bot size={23} />
        SmartBin AI
      </button>
    );
  }

  return (
    <aside className="sb-ai-panel">
      <header className="sb-ai-header">
        <div className="sb-ai-logo"><Bot size={27} /></div>
        <div className="sb-ai-title">
          <h2><Leaf size={17} /> SmartBin AI Assistant</h2>
          <p>Your waste management guide</p>
        </div>
        <button className="sb-ai-header-btn" onClick={() => setOpen(false)} aria-label="Minimize">
          <Minus size={20} />
        </button>
        <button className="sb-ai-header-btn" onClick={() => setOpen(false)} aria-label="Close">
          <X size={20} />
        </button>
      </header>

      <div className="sb-ai-chat">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`sb-ai-row ${message.role === "user" ? "sb-ai-user-row" : ""}`}
          >
            {message.role === "assistant" && (
              <div className="sb-ai-avatar"><Bot size={19} /></div>
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
            {message.role === "user" && <div className="sb-ai-user-avatar">U</div>}
          </div>
        ))}

        {loading && (
          <div className="sb-ai-row">
            <div className="sb-ai-avatar"><Bot size={19} /></div>
            <div className="sb-ai-bubble sb-ai-thinking">
              <LoaderCircle size={17} className="sb-ai-spinner" />
              Preparing response...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <section className="sb-ai-suggestions">
        <p>You can also ask:</p>
        <div className="sb-ai-suggestion-list">
          {suggestions.map(({ text, icon: Icon }) => (
            <button
              key={text}
              className="sb-ai-suggestion"
              disabled={loading}
              onClick={() => sendMessage(text)}
            >
              <Icon size={16} />
              <span>{text}</span>
            </button>
          ))}
        </div>
      </section>

      <form
        className="sb-ai-input-area"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask SmartBin AI anything..."
          aria-label="Type your message"
        />
        <button type="submit" disabled={!input.trim() || loading} aria-label="Send">
          <Send size={19} />
        </button>
      </form>
      <p className="sb-ai-disclaimer">AI preview · Live data requires backend integration</p>
    </aside>
  );
}
