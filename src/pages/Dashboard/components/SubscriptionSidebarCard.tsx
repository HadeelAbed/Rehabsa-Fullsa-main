import { useState } from "react";
import { X, MessageCircle, Sparkles, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

export function SubscriptionSidebarCard() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [dismissed, setDismissed] = useState(false);
  const storeName = (() => {
    try { return JSON.parse(localStorage.getItem("dashboard_user") || "{}").name || "متجري"; } catch { return "متجري"; }
  })();

  if (dismissed) return null;

  const handleContact = () => {
    const msg = encodeURIComponent(`${storeName}\n${storeName}\n${t("dashboard.sidebar.subscriptionCard.whatsappMsg")}`);
    window.open(`https://wa.me/966500000000?text=${msg}`, "_blank");
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative mx-3 my-3 group-data-[collapsible=icon]:hidden overflow-hidden rounded-2xl bg-gradient-to-br from-[#7c88c4] to-[#5b5ea6] shadow-[0_4px_20px_rgba(124,136,196,0.35)]">
      <div className="absolute inset-0 opacity-[0.07]">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white rounded-full blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-white rounded-full blur-xl" />
      </div>
      <div className="relative p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {t("dashboard.sidebar.subscriptionCard.remainingDays")}
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="w-5 h-5 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1.5 bg-white/10 px-2.5 py-1 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span className="text-sm font-bold text-white">Free Trial</span>
          </div>
          <span className="text-[11px] text-white/60">{t("dashboard.sidebar.subscriptionCard.subscribedTo")}</span>
        </div>

        <p className="text-[12px] text-yellow-300 font-semibold leading-relaxed mb-3">
          {t("dashboard.sidebar.subscriptionCard.activateText")}
        </p>

        <div className="w-full h-1 bg-white/15 rounded-full mb-4 overflow-hidden">
          <div className="h-full w-1/3 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full" />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContact}
            className="flex items-center gap-2 bg-white hover:bg-white/90 text-[#5b5ea6] text-sm font-semibold px-5 py-2 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95 w-full justify-center"
          >
            <MessageCircle className="w-4 h-4" />
            {t("dashboard.sidebar.subscriptionCard.contactUs")}
          </button>
        </div>
      </div>
    </div>
  );
}
