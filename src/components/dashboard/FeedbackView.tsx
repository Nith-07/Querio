import { useState } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Star, CheckCircle2 } from "lucide-react";

import { useAuth } from "@/contexts/AuthContext";

export const FeedbackView = () => {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating, comment: feedback }),
      });
      
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setFeedback("");
      }, 3000);
    } catch (error) {
      console.error('Failed to submit feedback');
    }
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center h-full min-h-[60vh] p-6">
        <div className="text-center animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-1">{t("feedbackSuccess")}</h3>
          <p className="text-sm text-muted-foreground">{t("feedbackNote")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-lg">
      <h2 className="text-xl font-semibold text-foreground mb-1">{t("feedbackTitle")}</h2>
      <p className="text-sm text-muted-foreground mb-8">{t("feedbackSubtext")}</p>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-3">{t("rateExperience")}</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              onMouseEnter={() => setHoveredStar(star)}
              onMouseLeave={() => setHoveredStar(0)}
              onClick={() => setRating(star)}
              className="p-1 transition-colors"
            >
              <Star
                className={`w-7 h-7 ${
                  star <= (hoveredStar || rating)
                    ? "fill-warning text-warning"
                    : "text-border"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder={t("feedbackPlaceholder")}
          rows={4}
          className="w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={rating === 0}
        className="rounded-md bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        {t("submitFeedback")}
      </button>
    </div>
  );
};
