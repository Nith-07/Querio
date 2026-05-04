import { Link } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Globe, MessageSquare, Bell } from "lucide-react";

const Index = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: MessageSquare, titleKey: "feature1Title", descKey: "feature1Desc" },
    { icon: Globe, titleKey: "feature2Title", descKey: "feature2Desc" },
    { icon: Bell, titleKey: "feature3Title", descKey: "feature3Desc" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="flex-1 flex items-center justify-center py-24 px-6">
        <div className="text-center max-w-2xl animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
            {t("heroTitle")}
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
            {t("heroSubtext")}
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/login"}
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {t("getStarted")}
            </Link>
            <Link
              to="/notices"
              className="inline-flex items-center justify-center rounded-md border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-colors"
            >
              {t("viewNotices")}
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-muted/50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
            {t("featuresTitle")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.titleKey}
                className="bg-card rounded-lg border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{t(feature.titleKey)}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
