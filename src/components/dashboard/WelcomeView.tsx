import { useTranslation } from "@/hooks/useTranslation";
import { MessageSquare } from "lucide-react";

export const WelcomeView = ({ onStartChat }: { onStartChat: () => void }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center h-full min-h-[80vh] p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">{t("welcome")}</h2>
        <p className="text-muted-foreground mb-8">{t("welcomeSubtext")}</p>
        <button
          onClick={onStartChat}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          {t("startChat")}
        </button>
      </div>
    </div>
  );
};
