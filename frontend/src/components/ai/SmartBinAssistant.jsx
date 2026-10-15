import { useState } from "react";
import { Bot, Send, User, Sparkles, RotateCcw } from "lucide-react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/constants";
import "../../style/smart-assistant.css";

const suggestions = [
  "How do I separate wet and dry waste?",
  "How can I recycle plastic?",
  "What should I do when a bin is full?",
  "How can we keep our city clean?",
];

export default function SmartBinAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! 👋 I'm your SmartBin AI Assistant. I can help you with waste segregation, recycling, bin monitoring, and keeping your city clean. What would you like to know?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(text = input) {
    const question = text.trim();

    if (!question || loading) return;

    setMessages((old) => [
      ...old,
      { role: "user", text: question },
    ]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/assistant/chat`,
        { message: question }
      );

      const answer =
        response.data?.answer ||
        response.data?.response ||
        response.data?.message ||
        "Sorry, I couldn't generate an answer.";

      setMessages((old) => [
        ...old,
        { role: "assistant", text: answer },
      ]);
    } catch {
      setMessages((old) => [
        ...old,
        {
          role: "assistant",
          text: "I couldn't connect to the AI service. Please make sure the backend is running and the assistant endpoint is configured.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="smart-assistant-page">
      <header className="smart-assistant-header">
        <div className="smart-assistant-heading">
          <div className="smart-assistant-logo">
            <Bot size={28} />
          </div>
          <div>
            <h2>SmartBin AI Assistant</h2>
            <p>
              Your intelligent companion for a cleaner city
            </p>
          </div>
        </div>

        <button
          className="smart-assistant-new-chat"
          onClick={() =>
            setMessages([
              {
                role: "assistant",
                text: "Hello again! What would you like to know about waste management?",
              },
            ])
          }
        >
          <RotateCcw size={16} />
          New chat
        </button>
      </header>

      <div className="smart-assistant-chat">
        <div className="smart-assistant-welcome">
          <div className="smart-assistant-welcome-icon">
            <Sparkles size={25} />
          </div>
          <h3>How can I help you today?</h3>
          <p>
            Ask me anything about waste segregation, recycling,
            and smart waste management.
          </p>
        </div>

        <div className="smart-assistant-messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`smart-assistant-message ${message.role}`}
            >
              <div className="smart-assistant-avatar">
                {message.role === "assistant" ? (
                  <Bot size={19} />
                ) : (
                  <User size={19} />
                )}
              </div>

              <div className="smart-assistant-bubble">
                <span>
                  {message.role === "assistant"
                    ? "SmartBin AI"
                    : "You"}
                </span>
                <p>{message.text}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="smart-assistant-typing">
              <Bot size={19} />
              Thinking of the best answer...
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="smart-assistant-suggestions">
            {suggestions.map((question) => (
              <button
                key={question}
                onClick={() => sendMessage(question)}
                disabled={loading}
              >
                <Sparkles size={15} />
                {question}
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
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Message SmartBin AI..."
            aria-label="Message SmartBin AI"
          />

          <button
            type="submit"
            disabled={!input.trim() || loading}
            aria-label="Send message"
          >
            <Send size={19} />
          </button>
        </form>

        <p className="smart-assistant-footer">
          SmartBin AI can make mistakes. Verify important waste-disposal
          instructions with your local waste-management authority.
        </p>
      </div>
    </section>
  );
}
