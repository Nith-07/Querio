import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { MessageSquare, Clock, Bell, HelpCircle, Star, LogOut, Home, User } from "lucide-react";
import { ChatView } from "@/components/dashboard/ChatView";
import { HistoryView } from "@/components/dashboard/HistoryView";
import { NoticesView } from "@/components/dashboard/NoticesView";
import { FAQView } from "@/components/dashboard/FAQView";
import { FeedbackView } from "@/components/dashboard/FeedbackView";
import { WelcomeView } from "@/components/dashboard/WelcomeView";
import { LanguageSelector } from "@/components/LanguageSelector";

type DashboardView = "welcome" | "chat" | "history" | "notices" | "faq" | "feedback";

const pathToView: Record<string, DashboardView> = {
  "/dashboard": "welcome",
  "/dashboard/chat": "chat",
  "/dashboard/history": "history",
  "/dashboard/notices": "notices",
  "/dashboard/faq": "faq",
  "/dashboard/feedback": "feedback",
  "/notices": "notices",
  "/faq": "faq",
};

const Dashboard = () => {
  const { t } = useTranslation();
  const { isAuthenticated, userEmail, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const activeView: DashboardView = pathToView[location.pathname] || "welcome";

  const menuItems: { key: DashboardView; path: string; icon: typeof MessageSquare; labelKey: string }[] = [
    { key: "chat", path: "/dashboard/chat", icon: MessageSquare, labelKey: "chat" },
    { key: "history", path: "/dashboard/history", icon: Clock, labelKey: "history" },
    { key: "notices", path: "/dashboard/notices", icon: Bell, labelKey: "notices" },
    { key: "faq", path: "/dashboard/faq", icon: HelpCircle, labelKey: "faq" },
    { key: "feedback", path: "/dashboard/feedback", icon: Star, labelKey: "feedback" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const viewMap: Record<DashboardView, React.ReactNode> = {
    welcome: <WelcomeView onStartChat={() => navigate("/dashboard/chat")} />,
    chat: <ChatView />,
    history: <HistoryView onOpenChat={() => navigate("/dashboard/chat")} />,
    notices: <NoticesView />,
    faq: <FAQView />,
    feedback: <FeedbackView />,
  };

  return (
    <div className="min-h-screen flex bg-muted/30">
      <aside className="w-60 bg-primary text-primary-foreground flex flex-col shrink-0">
        <div className="p-5 border-b border-primary-foreground/10">
          <h1 className="text-lg font-bold">Querio</h1>
          {isAuthenticated && userEmail && (
            <div className="flex items-center gap-2 mt-2">
              <div className="w-6 h-6 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <User className="w-3 h-3 text-primary-foreground" />
              </div>
              <p className="text-xs text-primary-foreground/60 truncate">{userEmail}</p>
            </div>
          )}
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
                activeView === item.key
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-primary-foreground/70 hover:bg-sidebar-accent/50 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {t(item.labelKey)}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-primary-foreground/10 space-y-2">
          <LanguageSelector className="w-full bg-sidebar-accent border-sidebar-border text-primary-foreground" />
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-primary-foreground/70 hover:bg-sidebar-accent/50 hover:text-primary-foreground transition-colors"
          >
            <Home className="w-4 h-4" />
            {t("home")}
          </button>
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-primary-foreground/70 hover:bg-sidebar-accent/50 hover:text-primary-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {t("logout")}
            </button>
          )}
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="animate-fade-in h-full">
          {viewMap[activeView]}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
