"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      if (!response.ok) throw new Error("API error");

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Omlouvám se, přátelé. Má mysl se na okamžik zatoulala. Zkuste to prosím znovu.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen max-w-2xl mx-auto px-4">
      {/* Header */}
      <header className="pt-8 pb-6 text-center">
        <div className="h-1 w-full bg-gradient-to-r from-czech-blue via-czech-red to-czech-blue rounded mb-4" />
        <h1 className="font-serif text-3xl md:text-4xl font-semibold text-czech-blue">
          T.G. Masaryk
        </h1>
        <p className="text-sm text-gray-600 mt-1 italic">
          "Pravda vítězí" — Truth prevails
        </p>
      </header>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
                msg.role === "user"
                  ? "bg-czech-blue text-white rounded-br-none"
                  : "bg-white border border-gray-200 text-gray-800 rounded-bl-none"
              }`}
            >
              <p className="text-sm md:text-base whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-none shadow-sm">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-czech-blue rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-czech-blue rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 bg-czech-blue rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 bg-czech-cream/90 backdrop-blur-sm py-4 flex gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Zeptejte se na cokoliv..."
          className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-czech-blue text-sm shadow-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-5 py-3 bg-czech-red text-white rounded-full font-medium text-sm shadow-md hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Poslat
        </button>
      </form>
    </div>
  );
}
