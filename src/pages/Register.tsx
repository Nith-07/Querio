import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "@/hooks/useTranslation";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

const Register = () => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const passwordStrength = (() => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  })();

  const strengthLabels = ["", t("weak"), t("fair"), t("good"), t("strong")];
  const strengthColors = ["", "bg-destructive", "bg-warning", "bg-primary", "bg-success"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name.trim()) newErrors.name = t("nameRequired");
    if (!emailRegex.test(email)) newErrors.email = t("invalidEmail");
    if (!password) newErrors.password = t("passwordRequired");
    if (password && password.length < 6) newErrors.password = t("passwordTooShort");
    if (password !== confirmPassword) newErrors.confirmPassword = t("passwordMismatch");

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setErrors({ email: data.error || 'Failed to register' });
        setIsLoading(false);
        return;
      }

      login(data.token, data.user.email, data.user.name);
      navigate("/dashboard");
    } catch (err) {
      setErrors({ email: 'Network error. Please try again.' });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4 py-8">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary">Querio</Link>
          <p className="text-sm text-muted-foreground mt-1">{t("heroSubtext")}</p>
        </div>
        <div className="bg-card rounded-lg border border-border p-6 shadow-card">
          <h2 className="text-xl font-semibold text-foreground mb-6">{t("createAccount")}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("nameLabel")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); setErrors({}); }}
                className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-shadow ${errors.name ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-ring"}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="mt-1.5 text-xs text-destructive">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("emailLabel")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors({}); }}
                className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-shadow ${errors.email ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-ring"}`}
                placeholder="you@university.edu"
              />
              {errors.email && <p className="mt-1.5 text-xs text-destructive">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("passwordLabel")}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors({}); }}
                  className={`w-full rounded-md border bg-background px-3 py-2.5 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-shadow ${errors.password ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-ring"}`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= passwordStrength ? strengthColors[passwordStrength] : "bg-border"}`} />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">{strengthLabels[passwordStrength]}</p>
                </div>
              )}
              {errors.password && <p className="mt-1.5 text-xs text-destructive">{errors.password}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">{t("confirmPasswordLabel")}</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setErrors({}); }}
                className={`w-full rounded-md border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-shadow ${errors.confirmPassword ? "border-destructive focus:ring-destructive/30" : "border-input focus:ring-ring"}`}
                placeholder="••••••••"
              />
              {confirmPassword && password === confirmPassword && (
                <p className="mt-1.5 text-xs text-primary flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {t("passwordsMatch")}</p>
              )}
              {errors.confirmPassword && <p className="mt-1.5 text-xs text-destructive">{errors.confirmPassword}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 active:scale-[0.98] disabled:opacity-70 transition-all flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? t("creatingAccount") : t("registerBtn")}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">{t("loginBtn")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
