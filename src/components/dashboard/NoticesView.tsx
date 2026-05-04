import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  department: string;
}

export const NoticesView = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: notices = [], isLoading } = useQuery<Notice[]>({
    queryKey: ['notices'],
    queryFn: async () => {
      const res = await fetch('/api/notices', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    enabled: !!token,
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">{t("noticesTitle")}</h2>
        <LanguageSelector />
      </div>
      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : (
        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="rounded-lg border border-border bg-card shadow-card overflow-hidden"
            >
              <button
                onClick={() => setExpanded(expanded === notice.id ? null : notice.id)}
                className="w-full flex items-start justify-between p-4 text-left"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{notice.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{notice.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">{new Date(notice.date).toLocaleDateString()}</p>
                </div>
                {expanded === notice.id ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0 mt-1" />
                )}
              </button>
              {expanded === notice.id && (
                <div className="px-4 pb-4 pt-0 border-t border-border">
                  <p className="text-sm text-foreground leading-relaxed pt-3">{notice.content}</p>
                  <p className="text-xs text-muted-foreground mt-2 italic">- {notice.department}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
