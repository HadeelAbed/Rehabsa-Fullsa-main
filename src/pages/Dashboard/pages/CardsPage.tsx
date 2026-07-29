import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Dot, Star, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useNavigate } from "react-router-dom";
import { TEMPLATES_COUNT } from "./TemplatesPage";

const defaultCards = [
  {
    id: 1,
    name: "نادي اللياقة النخبة",
    title: "تدرب وادخر",
    description: "استمتع بمرافقنا الفاخرة واحصل على مكافآت حصرية!",
    cardId: "477-398-475-609",
    issueDate: new Date("2025-07-08").toISOString(),
    expiryDate: new Date("2027-08-30").toISOString(),
    bgColor: "#7c88c4",
    bgOpacity: 0.9,
    bgImage: "https://reward-loyalty-demo.nowsquare.com/files/126/conversions/1-sm.jpg",
    textColor: "#ffffff",
    status: "نشط",
    currentStage: 2,
    totalStages: 5,
  },
  {
    id: 2,
    name: "مغاسل وتلميع تذكار",
    title: "غسيل احترافي",
    description: "احصل على خدمات الغسيل والتلميع بجودة عالية ومكافآت مميزة",
    cardId: "123-456-789-012",
    issueDate: new Date("2025-01-15").toISOString(),
    expiryDate: new Date("2026-01-15").toISOString(),
    bgColor: "#5a68b0",
    bgOpacity: 0.9,
    bgImage: "",
    textColor: "#ffffff",
    status: "نشط",
    currentStage: 1,
    totalStages: 4,
  },
];

const defaultCardsIds = new Set(defaultCards.map(c => c.id));

export function CardsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, { customers: number; points: number; redeemed: number }>>({});
  const customDesignsCount = cards.filter(c => !defaultCardsIds.has(c.id)).length;

  const computeStats = (cardList: any[]) => {
    const raw = localStorage.getItem("customer_points");
    let ptsMap: Record<string, Record<string, number>> = {};
    try {
      if (raw) {
        const parsed = JSON.parse(raw);
        if (typeof parsed === "object" && !Array.isArray(parsed)) {
          const firstVal = Object.values(parsed)[0];
          if (typeof firstVal === "number") {
            const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");
            const migrated: Record<string, Record<string, number>> = {};
            for (const [cid, pts] of Object.entries(parsed)) {
              const cardId = cardMap[cid] || "000-000-000-000";
              if (!migrated[cardId]) migrated[cardId] = {};
              migrated[cardId][cid] = pts as number;
            }
            localStorage.setItem("customer_points", JSON.stringify(migrated));
            ptsMap = migrated;
          } else {
            ptsMap = parsed;
          }
        }
      }
    } catch { /* ignore */ }

    const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");
    const customers = JSON.parse(localStorage.getItem("registered_customers") || "[]") as any[];
    const auditRaw = localStorage.getItem("audit_logs") || "[]";
    const audit: any[] = JSON.parse(auditRaw);
    const redeemedEvents = audit.filter((e: any) =>
      e.event?.includes("استبدل") || e.event?.includes("Redeemed")
    );
    const customerNameToId: Record<string, string> = {};
    for (const c of customers) {
      customerNameToId[c.fullName] = String(c.id);
    }

    const result: Record<string, { customers: number; points: number; redeemed: number }> = {};
    for (const card of cardList) {
      const cid = card.cardId;
      const linkedFromCardMap = Object.entries(cardMap).filter(([, v]) => v === cid).map(([k]) => k);
      const cardPts = ptsMap[cid] || {};
      const ptsCustomerIds = Object.keys(cardPts);
      const allIds = new Set([...linkedFromCardMap, ...ptsCustomerIds]);
      let totalPts = 0;
      for (const cusId of allIds) {
        totalPts += cardPts[cusId] || 0;
      }
      let redeemedCount = 0;
      for (const ev of redeemedEvents) {
        const custId = customerNameToId[ev.customerName];
        if (custId && (cardMap[custId] === cid || linkedFromCardMap.includes(custId) || ptsCustomerIds.includes(custId))) {
          redeemedCount++;
        }
      }
      result[cid] = { customers: allIds.size, points: totalPts, redeemed: redeemedCount };
    }
    setStats(result);
  };

  const loadCards = () => {
    const savedCards = JSON.parse(localStorage.getItem("dashboard_cards") || "[]");
    const uniqueSavedCards = savedCards.filter((card: any) => !defaultCardsIds.has(card.id));
    const allCards = [
      ...defaultCards.map(card => ({
        ...card,
        issueDate: new Date(card.issueDate),
        expiryDate: new Date(card.expiryDate),
      })),
      ...uniqueSavedCards.map((card: any) => ({
        ...card,
        issueDate: new Date(card.issueDate),
        expiryDate: card.expiryDate ? new Date(card.expiryDate) : null,
      })),
    ];
    setCards(allCards);
    computeStats(allCards);
  };

  useEffect(() => {
    loadCards();
    const handleFocus = () => loadCards();
    const relevantKeys = new Set(["dashboard_cards", "customer_card", "customer_points", "registered_customers", "audit_logs"]);
    const handleStorageChange = (e: StorageEvent) => {
      if (relevantKeys.has(e.key)) loadCards();
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <div className="px-4 md:px-10 py-6">
      {/* Welcome */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            {t("dashboardPages.cards.welcome") || "مرحباً"}
          </h1>
          <p className="text-gray-500 text-sm">
            {t("dashboardPages.cards.welcomeDescription") || "إليك نظرة عامة على أداء برامج الولاء"}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/cards/create')}
          className="flex items-center gap-1.5 bg-[#7c88c4] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#5a68b0] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t("dashboardPages.cards.createCard") || "إنشاء بطاقة"}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* Templates Card */}
        <div className="bg-white rounded-xl shadow-[0_4px_24px_rgba(124,136,196,.12)] p-3 flex flex-col items-center">
          <div dir="ltr" className="relative flex flex-col items-center w-full cursor-pointer" onClick={() => navigate('/dashboard/cards/templates')}>
            <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold text-[#7c88c4] bg-[#f0f1fa] px-2 py-0.5 rounded-full">
              <Plus className="w-3 h-3" />
              {t("dashboardPages.cards.readyTemplates") || "قوالب جاهزة"}
            </div>
            <div className="overflow-hidden relative w-[150px] sm:w-[170px] my-2">
              <img alt={t("dashboardPages.cards.readyTemplates")} src="/dashboard/ios.svg" className="w-full h-full object-contain" />
              <div className="absolute top-[40%] right-[50%] translate-x-[50%] translate-y-[-50%] flex items-center justify-center">
                <Plus className="w-10 h-10 text-[#7c88c4]" strokeWidth={3} />
              </div>
            </div>
          </div>
          <h2 className="text-sm font-semibold text-gray-800 mb-2 truncate max-w-full">{t("dashboardPages.cards.readyTemplates") || "قوالب جاهزة"}</h2>
          <div className="flex items-center justify-center gap-3 mb-2 text-center text-gray-500">
              <div>
                <div className="text-[9px]">{t("dashboardPages.cards.templatesCount")}</div>
                <div className="text-[11px] font-semibold text-gray-700">{TEMPLATES_COUNT}</div>
              </div>
              <div>
                <div className="text-[9px]">{t("dashboardPages.cards.customDesigns")}</div>
                <div className="text-[11px] font-semibold text-gray-700">{customDesignsCount}</div>
              </div>
          </div>
          <button onClick={() => navigate('/dashboard/cards/templates')} className="w-full py-1.5 rounded-lg bg-[#7c88c4] text-white text-xs font-medium hover:bg-[#5a68b0] transition-colors">
            {t("dashboardPages.cards.readyTemplates") || "قوالب جاهزة"}
          </button>
        </div>

        {cards.map((card) => {
          const hexToRgb = (hex: string) => {
            const cleanHex = hex.replace('#', '');
            const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
            return result
              ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
              : { r: 52, g: 152, b: 219 };
          };

          const rgb = hexToRgb(card.bgColor);
          const gradientStyle = card.bgImage
            ? { backgroundImage: `linear-gradient(rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity}), rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity})), url("${card.bgImage}")` }
            : { backgroundColor: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${card.bgOpacity})` };

          return (
            <div key={card.id} className="bg-white rounded-xl shadow-[0_4px_24px_rgba(124,136,196,.12)] p-3 flex flex-col items-center cursor-pointer hover:shadow-[0_12px_48px_rgba(124,136,196,.26)] hover:-translate-y-1 transition-all duration-200" onClick={() => navigate(`/dashboard/cards/${card.id}`)}>
              <div dir="ltr" className="relative flex flex-col items-center w-full">
                <div className="flex items-center gap-1.5 mb-1 text-[10px] font-semibold text-[#7c88c4] bg-[#f0f1fa] px-2 py-0.5 rounded-full">
                  <span className="w-1 h-1 rounded-full bg-emerald-500" />
                  {card.status}
                </div>
                <div className="overflow-hidden relative w-[150px] sm:w-[170px] my-2">
                  <img alt={t("dashboardPages.cards.title")} src="/dashboard/ios.svg" className="w-full h-full object-contain" />
                  <div
                    className="w-[82%] h-[65%] absolute top-[18%] right-[50%] translate-x-[50%] rounded-lg shadow-[0px_2px_8px_rgba(0,0,0,0.15)] overflow-hidden bg-fixed bg-center bg-cover bg-no-repeat"
                    style={{ ...gradientStyle, color: card.textColor }}
                    dir="rtl"
                  >
                    <div className="h-full flex flex-col p-1.5">
                      <div className="flex flex-col items-center justify-center mb-1">
                        <div className="text-center mb-0.5">
                          <div className="text-[7px] font-medium leading-tight">
                            <span className="tracking-tight">{card.name}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-center">
                          <span className="text-[6px] font-semibold opacity-90">{t("dashboardPages.cards.stage")}: {card.currentStage}/{card.totalStages}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-center gap-0.5 mb-1 pb-1 border-b border-white/20">
                        {Array.from({ length: card.totalStages }).map((_, index) => {
                          const stageNumber = index + 1;
                          const isCompleted = stageNumber < card.currentStage;
                          const isCurrent = stageNumber === card.currentStage;
                          return (
                            <div key={index} className="relative flex items-center justify-center">
                              <Star
                                className={`transition-all duration-300 ${
                                  isCompleted ? 'fill-yellow-500 text-yellow-500' : isCurrent ? 'fill-yellow-500 text-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.9)] scale-125 animate-pulse' : 'fill-yellow-500/30 text-yellow-500/30'
                                }`}
                                size={10}
                                strokeWidth={2}
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className="flex-grow min-w-0 overflow-hidden text-center mb-1">
                        <h3 className="text-[7px] font-extralight line-clamp-1 leading-tight">{card.title}</h3>
                        <div className="line-clamp-2 font-light text-[6px] leading-tight">{card.description}</div>
                      </div>
                      <div className="flex items-center justify-center mb-1">
                        <div className="rounded w-[60px] h-[60px] flex place-content-center items-center shadow-sm" style={{ backgroundColor: "#ffffff" }}>
                          <svg className="w-[50px] h-[50px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" style={{ stroke: card.bgColor }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex self-end mt-auto pt-1 border-t border-white/20">
                        <div className="flex-grow text-right">
                          <div className="text-[4px] font-extralight opacity-80">{t("dashboardPages.cards.viewCard.cardId")}</div>
                          <div className="text-[6px] font-light truncate">{card.cardId}</div>
                        </div>
                        <div className="flex-none w-10 text-left hidden md:block">
                          <div className="text-[4px] font-extralight opacity-80">{t("dashboardPages.cards.viewCard.issueDate")}</div>
                          <div className="text-[6px] font-light">{format(card.issueDate, "dd MMM yyyy", { locale: ar })}</div>
                        </div>
                        <div className="flex-none w-10 text-left">
                          <div className="text-[4px] font-extralight opacity-80">{t("dashboardPages.cards.viewCard.expiryDate")}</div>
                          <div className="text-[6px] font-light">{card.expiryDate ? format(card.expiryDate, "dd MMM yyyy", { locale: ar }) : t("dashboardPages.cards.viewCard.unlimited")}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <h2 className="text-sm font-semibold text-gray-800 mb-2 truncate max-w-full">{card.name}</h2>
              <div className="flex items-center justify-center gap-3 mb-2 text-center text-gray-500">
                <div>
                  <div className="text-[9px]">{t("dashboardPages.cards.viewCard.customers")}</div>
                  <div className="text-[11px] font-semibold text-gray-700">{stats[card.cardId]?.customers ?? 0}</div>
                </div>
                <div>
                  <div className="text-[9px]">{t("dashboardPages.cards.points")}</div>
                  <div className="text-[11px] font-semibold text-gray-700">{stats[card.cardId]?.points ?? 0}</div>
                </div>
                <div>
                  <div className="text-[9px]">{t("dashboardPages.cards.viewCard.redeemedPoints") || "النقاط المستبدلة"}</div>
                  <div className="text-[11px] font-semibold text-gray-700">{stats[card.cardId]?.redeemed ?? 0}</div>
                </div>
              </div>
              <div className="w-full py-1.5 rounded-lg bg-[#7c88c4] text-white text-xs font-medium text-center">
                {t("dashboardPages.cards.manage") || "إدارة"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
