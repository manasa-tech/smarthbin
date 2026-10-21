import { useState } from "react";
import { Bot, X, Send, Sparkles, Trash2, MapPin, Recycle, Minimize2 } from "lucide-react";
import "../styles/floating-assistant.css";

const suggestions = [
  "How do I manage overflowing bins?",
  "How can I optimize collection routes?",
  "How should I sort plastic waste?",
  "How do I check citizen reports?",
];

function getReply(message) {
  const text = message.toLowerCase();

  if (text.includes("overflow") || text.includes("full bin")) {
    return "Open Overflow Prediction to review bins that may need collection. Prioritize high-fill bins and confirm the latest readings before scheduling pickup.";
  }

  if (text.includes("route") || text.includes("collection")) {
    return "Open Route Optimizer to plan collection routes. Consider bin fill levels, truck capacity, travel distance, and collection priorities.";
  }

  if (text.includes("plastic") || text.includes("recycl") || text.includes("sort")) {
    return "Separate recyclable materials according to local collection rules. Keep suitable plastic, paper, glass, and metal apart from food waste, and check local guidance for contaminated packaging.";
  }

  if (text.includes("report") || text.includes("citizen")) {
    return "Open Citizen Reports to review reported issues, or Reports History to search past reports and check their status.";
  }

  if (text.includes("classif") || text.includes("identify")) {
    return "Open AI Waste Classifier to classify a waste image. Verify uncertain results before disposing of batteries, electronics, chemicals, or other potentially hazardous materials.";
  }

  if (/^(hi|hello|hey)\b/.test(text)) {
    return "Hi! 👋 I'm Binny, your SmartBin AI assistant. I can help you navigate waste reports, collection routes, overflow predictions, and recycling.";
  }

  return "I can help with SmartBin AI features, including overflow prediction, route optimization, waste classification, citizen reports, and recycling. This version uses demo responses rather than live AI.";
}

export default function FloatingAssistant() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm Binny, your SmartBin AI assistant. What would you like help with today?",
    },
  ]);

  function sendMessage(value = input) {
    const text = value.trim();
    if (!text || typing) return;

    setMessages((old) => [...old, { role: "user", text }]);
    setInput("");
    setTyping(true);

    // Demo-only response. Connect your FastAPI endpoint for real AI.
    window.setTimeout(() => {
      setMessages((old) => [
        ...old,
        { role: "assistant", text: getReply(text) },
      ]);
      setTyping(false);
    }, 400);
  }

  function handleSubmit(event) {
    event.preventDefault();
    sendMessage();
  }

  return (
    <div className="fa-widget">
      {open && !minimized && (
        <section className="fa-panel" aria-label="SmartBin AI chat">
          <header className="fa-header">
            <div className="fa-avatar"><Bot size={24} /></div>
            <div className="fa-header-info">
              <strong>Binny AI Assistant</strong>
              <span><i /> SmartBin support</span>
            </div>
            <button type="button" className="fa-icon-button" onClick={() => setMinimized(true)} aria-label="Minimize chat">
              <Minimize2 size={17} />
            </button>
            <button type="button" className="fa-icon-button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X size={19} />
            </button>
          </header>

          <div className="fa-intro">
            <span><Sparkles size={17} /></span>
            <div>
              <strong>How can I help you?</strong>
              <p>Ask about bins, reports, routes, or recycling.</p>
            </div>
          </div>

          <div className="fa-messages" aria-live="polite">
            {messages.map((message, index) => (
              <div className={`fa-message ${message.role}`} key={index}>
                {message.role === "assistant" && (
                  <span className="fa-message-icon"><Bot size={15} /></span>
                )}
                <div className="fa-bubble">{message.text}</div>
              </div>
            ))}

            {typing && (
              <div className="fa-message assistant">
                <span className="fa-message-icon"><Bot size={15} /></span>
                <div className="fa-bubble fa-typing"><i /><i /><i /></div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="fa-suggestions">
              <span className="fa-suggestions-label">SUGGESTED QUESTIONS</span>
              {suggestions.map((suggestion, index) => {
                const Icon = [Trash2, MapPin, Recycle, Sparkles][index];
                return (
                  <button type="button" key={suggestion} onClick={() => sendMessage(suggestion)}>
                    <Icon size={15} />
                    {suggestion}
                  </button>
                );
              })}
            </div>
          )}

          <form className="fa-compose" onSubmit={handleSubmit}>
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask Binny anything..."
              aria-label="Your message"
            />
            <button type="submit" disabled={!input.trim() || typing} aria-label="Send message">
              <Send size={17} />
            </button>
          </form>

          <p className="fa-disclaimer">Demo assistant · Verify important information</p>
        </section>
      )}

      {open && minimized && (
        <button className="fa-minimized" onClick={() => setMinimized(false)}>
          <Bot size={20} /> Binny AI <span>Return to chat</span>
        </button>
      )}

      <button
        type="button"
        className={`fa-launcher ${open && !minimized ? "fa-launcher-open" : ""}`}
        onClick={() => {
          if (open && minimized) {
            setMinimized(false);
          } else {
            setOpen((previous) => !previous);
            setMinimized(false);
          }
        }}
        aria-label={open ? "Close AI assistant" : "Open AI assistant"}
      >
        {open && !minimized ? <X size={25} /> : <Bot size={27} />}
        {!open && <span className="fa-launcher-sparkle"><Sparkles size={12} /></span>}
      </button>
    </div>
  );
}
