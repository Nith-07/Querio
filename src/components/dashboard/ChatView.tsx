import { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { useChat } from "@/contexts/ChatContext";
import { Send, Loader2, Bot, User } from "lucide-react";

function formatTime(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export const ChatView = () => {
  const { t } = useTranslation();
  const { activeThreadId, createThread, sendMessage, getActiveThread, isLoadingHistory } = useChat();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentThread = getActiveThread();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentThread?.messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const threadId = activeThreadId || createThread();
    
    const messageContent = input;
    setInput("");
    setIsLoading(true);

    await sendMessage(threadId, messageContent);
    setIsLoading(false);
  };

  if (isLoadingHistory) {
    return (
      <div className="flex flex-col h-full min-h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm">Loading chat history...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-[80vh]">
      {/* Header */}
      <div className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground text-sm">{t("chat")}</h2>
            <p className="text-xs text-muted-foreground">{isLoading ? "Thinking..." : "AI Assistant Online"}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {!currentThread || currentThread.messages.length === 0 ? (
           <div className="flex justify-center pt-10">
             <div className="text-center max-w-md">
               <Bot className="w-12 h-12 text-primary/40 mx-auto mb-4" />
               <h3 className="text-lg font-medium text-foreground mb-2">How can I help you today?</h3>
               <p className="text-sm text-muted-foreground">I am powered by Gemini AI and have access to all SRMIST FAQs and Notices. Ask me anything in English, Hindi, Tamil, or Telugu!</p>
             </div>
           </div>
        ) : (
          currentThread.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "bot" && (
                <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
              )}
              <div className="max-w-[70%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-accent text-accent-foreground rounded-bl-md"
                  }`}
                >
                  {msg.content}
                </div>
                <p className={`text-[10px] text-muted-foreground mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  {formatTime(msg.createdAt)}
                </p>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-primary-foreground" />
                </div>
              )}
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex gap-2.5 justify-start">
            <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Bot className="w-3.5 h-3.5 text-primary" />
            </div>
            <div className="bg-accent text-accent-foreground rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Actions */}
      {(!currentThread || currentThread.messages.length === 0) && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          {["Exam schedule", "Fee details", "Hostel info", "Recent Notices"].map((q) => (
            <button
              key={q}
              onClick={() => { setInput(q); }}
              className="text-xs border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border bg-background p-4">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder={t("typeMessage")}
            className="flex-1 rounded-full border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="inline-flex items-center justify-center rounded-full bg-primary w-10 h-10 text-primary-foreground hover:bg-primary/90 disabled:opacity-50 active:scale-95 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
