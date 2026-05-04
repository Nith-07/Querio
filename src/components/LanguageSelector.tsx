import { useTranslation } from "@/hooks/useTranslation";
import { Language } from "@/data/translations";

const languageLabels: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  ta: "தமிழ்",
  te: "తెలుగు",
};

export const LanguageSelector = ({ className }: { className?: string }) => {
  const { language, setLanguage } = useTranslation();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className={`rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${className || ""}`}
    >
      {Object.entries(languageLabels).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
};
