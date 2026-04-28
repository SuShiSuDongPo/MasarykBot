import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

function formatContent(text: string): string {
  // Convert both *single* and **double** asterisks to <strong>
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<strong>$1</strong>");
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Dobrý den! Jsem Tomáš Garrigue Masaryk, velmi uvolněný. Ptejte se na cokoli – o životě, pravdě, demokracii. Mluvím česky i anglicky, podle vás.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Omlouvám se, přátelé. Má mysl se na okamžik zatoulala." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        body {
          margin: 0;
          background: linear-gradient(135deg, #F5F0E8, #fff, #F5F0E8);
          font-family: Georgia, 'Times New Roman', serif;
          color: #11457E;
        }
        .chat-container {
          max-width: 700px;
          margin: 0 auto;
          padding: 20px;
          height: 100vh;
          display: flex;
          flex-direction: column;
        }
        .header-line {
          height: 3px;
          background: linear-gradient(to right, #11457E, #D7141A, #11457E);
          margin-bottom: 20px;
        }
        .messages {
          flex: 1;
          overflow-y: auto;
          padding-right: 5px;
        }
        .msg {
          display: flex;
          margin-bottom: 12px;
        }
        .msg.user {
          justify-content: flex-end;
        }
        .bubble {
          max-width: 85%;
          padding: 10px 16px;
          border-radius: 16px;
          font-size: 15px;
          line-height: 1.5;
          white-space: pre-wrap;
        }
        .user .bubble {
          background: #11457E;
          color: white;
          border-bottom-right-radius: 4px;
        }
        .assistant .bubble {
          background: white;
          border: 1px solid #ddd;
          color: #333;
          border-bottom-left-radius: 4px;
        }
        .input-area {
          display: flex;
          gap: 8px;
          padding: 15px 0;
          background: rgba(245,240,232,0.9);
          backdrop-filter: blur(5px);
        }
        input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ccc;
          border-radius: 20px;
          font-size: 14px;
          outline: none;
        }
        button {
          background: #D7141A;
          color: white;
          border: none;
          border-radius: 20px;
          padding: 10px 20px;
          font-weight: bold;
          cursor: pointer;
        }
        button:disabled {
          opacity: 0.5;
          cursor: default;
        }
        .typing span {
          display: inline-block;
          width: 6px;
          height: 6px;
          background: #11457E;
          border-radius: 50%;
          margin-right: 4px;
          animation: bounce 1s infinite;
        }
        .typing span:nth-child(2) { animation-delay: 0.2s; }
        .typing span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .bubble strong {
          color: inherit;
        }
      `}</style>

      <div className="chat-container">
        <div className="header-line" />
        <h1 style={{ fontStyle: "italic", margin: "10px 0", textAlign: "center" }}>
          T.G. Masaryk – Pravda vítězí
        </h1>

        <div className="messages">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              <div
                className="bubble"
                dangerouslySetInnerHTML={{ __html: formatContent(msg.content) }}
              />
            </div>
          ))}
          {loading && (
            <div className="msg assistant">
              <div className="bubble typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="input-area" onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Zeptejte se..."
            disabled={loading}
          />
          <button type="submit" disabled={loading || !input.trim()}>
            Poslat
          </button>
        </form>
      </div>
    </>
  );
}
