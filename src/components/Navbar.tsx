import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { LanguageSelector } from "./LanguageSelector";

export const Navbar = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        <Link to="/" className="text-xl font-bold text-primary tracking-tight">
          Querio
        </Link>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">{t("home")}</Link>
            <a href="/#features" className="text-muted-foreground hover:text-foreground transition-colors">{t("features")}</a>
            <Link to="/dashboard/notices" className="text-muted-foreground hover:text-foreground transition-colors">{t("notices")}</Link>
            <Link to="/dashboard/faq" className="text-muted-foreground hover:text-foreground transition-colors">{t("faq")}</Link>
          </div>
          <LanguageSelector />
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("loginBtn")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
