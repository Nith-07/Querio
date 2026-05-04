import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-3">Querio</h3>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
              {t("footerDesc")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">{t("quickLinks")}</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link to="/" className="opacity-80 hover:opacity-100 transition-opacity">{t("home")}</Link>
              <Link to="/notices" className="opacity-80 hover:opacity-100 transition-opacity">{t("notices")}</Link>
              <Link to="/faq" className="opacity-80 hover:opacity-100 transition-opacity">{t("faq")}</Link>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider opacity-70">{t("contact")}</h4>
            <div className="flex flex-col gap-2 text-sm opacity-80">
              <span>support@querio.edu</span>
              <span>+91 1800 200 3000</span>
              <span>University Campus, Block A</span>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-primary-foreground/20 text-center text-sm opacity-60">
          {t("footerRights")}
        </div>
      </div>
    </footer>
  );
};
