import { useTranslation } from "@/hooks/useTranslation";
import { useChat } from "@/contexts/ChatContext";
import { MessageSquare, Clock, ChevronRight } from "lucide-react";

export const HistoryView = ({ onOpenChat }: { onOpenChat: () => void }) => {
  const { t } = useTranslation();
  const { threads, setActiveThread } = useChat();

  const handleOpenThread = (id: string) => {
    setActiveThread(id);
    onOpenChat();
  };

  return (
    <div className="p-6 max-w-3xl">
      <h2 className="text-xl font-semibold text-foreground mb-1">{t("chatHistory")}</h2>
      <p className="text-sm text-muted-foreground mb-6">View and resume previous conversations</p>
      {threads.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Clock className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground text-sm mb-1">{t("noHistory")}</p>
          <p className="text-xs text-muted-foreground">Your conversations will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {threads.map((thread) => {
            const lastMsg = thread.messages[thread.messages.length - 1];
            return (
              <button
                key={thread.id}
                onClick={() => handleOpenThread(thread.id)}
                className="w-full flex items-center gap-4 rounded-lg border border-border bg-card p-4 text-left hover:shadow-card-hover hover:border-primary/20 transition-all group"
              >
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
                  {lastMsg && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">{lastMsg.content.slice(0, 60)}</p>
                  )}
                  <p className="text-[10px] text-muted-foreground mt-1">
                    {thread.messages.length} messages · {new Date(thread.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
