import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/data/translations";

export const useTranslation = () => {
  const { language, setLanguage } = useLanguage();
  const t = (key: string): string => translations[language]?.[key] || translations.en[key] || key;
  return { t, language, setLanguage };
};
