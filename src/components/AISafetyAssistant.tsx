import { useState } from "react";
import { Bot, Send, X, MessageCircle } from "lucide-react";
import { CommunityAreaRisk } from "../services/risk";

interface AISafetyAssistantProps {
  riskData: CommunityAreaRisk | null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const API_BASE_URL = "http://localhost:5001/api";

const QUICK_QUESTIONS = [
  "Why is this area considered high risk?",
  "What incidents were reported?",
  "What precautions should I take?",
  "Is there public data for this area?",
];

export default function AISafetyAssistant({
  riskData,
}: AISafetyAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm SwaShakti AI Safety Assistant. Ask me about the current risk area, reported incidents, or practical safety precautions.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  function askQuickQuestion(question: string) {
  setInput(question);
}

  async function sendMessage() {
    const message = input.trim();

    if (!message || loading) return;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: message,
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/ai/assistant`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            riskData,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "AI Safety Assistant is unavailable"
        );
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.data.reply,
        },
      ]);
    } catch (error) {
      console.error(
        "AI Safety Assistant error:",
        error
      );

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I'm temporarily unable to connect to the AI service. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#6C3EFF] px-5 py-3 text-white shadow-lg transition hover:scale-105"
        >
          <MessageCircle size={20} />
          <span className="font-medium">
            SwaShakti AI
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[560px] w-[380px] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between bg-[#6C3EFF] px-4 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-white/20 p-2">
                <Bot size={20} />
              </div>

              <div>
                <h3 className="font-semibold">
                  SwaShakti AI
                </h3>

                <p className="text-xs text-white/80">
                  Safety Assistant
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 transition hover:bg-white/20"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current risk */}
          {riskData && (
            <div className="border-b bg-gray-50 px-4 py-3">
              <p className="text-xs text-gray-500">
                Current risk area
              </p>

              <div className="mt-1 flex items-center justify-between">
                <span className="font-medium text-gray-800">
                  {riskData.location}
                </span>

                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    riskData.riskLevel === "HIGH"
                      ? "bg-red-100 text-red-700"
                      : riskData.riskLevel ===
                        "MEDIUM"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {riskData.riskLevel}
                </span>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4">

            {messages.length === 1 && (
  <div className="mb-4 space-y-2">
    <p className="text-xs font-medium text-gray-500">
      Quick questions
    </p>

    <div className="flex flex-wrap gap-2">
      {QUICK_QUESTIONS.map((question) => (
        <button
          key={question}
          onClick={() => askQuickQuestion(question)}
          className="rounded-full border border-purple-200 bg-purple-50 px-3 py-2 text-left text-xs font-medium text-[#6C3EFF] transition hover:bg-purple-100"
        >
          {question}
        </button>
      ))}
    </div>
  </div>
)}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${
                    message.role === "user"
                      ? "bg-[#6C3EFF] text-white"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                  SwaShakti AI is thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="Ask about safety..."
                disabled={loading}
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#6C3EFF]"
              />

              <button
                onClick={sendMessage}
                disabled={
                  loading || !input.trim()
                }
                className="rounded-xl bg-[#6C3EFF] p-3 text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}