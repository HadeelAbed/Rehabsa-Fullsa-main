import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Dot, Star, Plus, Edit } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";
import { useNavigate } from "react-router-dom";


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

];

const defaultCardsIds = new Set(defaultCards.map(c => c.id));

export function CardsPage() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const [cards, setCards] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, { customers: number; points: number; redeemed: number }>>({});


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
    let savedCards = JSON.parse(localStorage.getItem("dashboard_cards") || "[]") as any[];
    savedCards = savedCards.filter((c: any) => c.id !== 2 && c.name !== "مغاسل وتلميع تذكار");
    const savedIds = new Set(savedCards.map((c: any) => c.id));
    for (const dc of defaultCards) {
      if (!savedIds.has(dc.id)) {
        savedCards.push({ ...dc });
      }
    }
    localStorage.setItem("dashboard_cards", JSON.stringify(savedCards));
    const allCards = savedCards.map((card: any) => ({
      ...card,
      issueDate: card.issueDate ? new Date(card.issueDate) : new Date(),
      expiryDate: card.expiryDate ? new Date(card.expiryDate) : null,
    }));
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
    <div className="px-4 md:px-10 py-3 bg-[#fafbff] min-h-screen">
      {/* Welcome */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h1 className="text-xl font-medium text-[#111111] mb-1">
            {t("dashboardPages.cards.welcome") || "مرحباً"}
          </h1>
          <p className="text-[#5f6678] text-sm">
            {t("dashboardPages.cards.welcomeDescription") || "إليك نظرة عامة على أداء برامج الولاء"}
          </p>
        </div>
        <button
          onClick={() => navigate('/dashboard/cards/create')}
          className="flex items-center gap-1.5 bg-[#7c88c4] text-white px-4 py-2 rounded-2xl text-sm font-semibold hover:bg-[#5a68b0] transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          {t("dashboardPages.cards.createCard") || "إنشاء بطاقة"}
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Create Program Card */}
        <div
          onClick={() => navigate('/dashboard/cards/create')}
          className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-2 flex flex-col items-center justify-center cursor-pointer hover:shadow-md hover:-translate-y-[2px] transition-all duration-200 min-h-[100px]"
        >
          <div className="w-8 h-8 rounded-full bg-[#f7f9ff] flex items-center justify-center mb-1">
            <Plus className="w-4 h-4 text-[#7c88c4]" strokeWidth={2} />
          </div>
          <h2 className="text-sm font-medium text-[#111111] text-center">
            {t("dashboardPages.cards.createCard") || "إنشاء برنامج"}
          </h2>
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
            <div key={card.id} className="bg-white rounded-2xl border border-[#e5e7eb] shadow-sm p-2 flex flex-col items-center cursor-pointer hover:shadow-md hover:-translate-y-[2px] transition-all duration-200" onClick={() => navigate(`/dashboard/cards/${card.id}`)}>
              <div dir="ltr" className="relative flex flex-col items-center w-full">
                <div className="flex items-center justify-between w-full mb-0.5">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/cards/edit/${card.id}`); }} className="text-[#7c88c4] hover:text-[#5a68b0] transition-colors p-0.5">
                    <Edit className="w-3 h-3" />
                  </button>
                  <div className="flex items-center gap-1 text-[9px] font-medium text-[#7c88c4] bg-[#f7f9ff] px-1.5 py-0.5 rounded-full">
                    <span className="w-1 h-1 rounded-full bg-emerald-500" />
                    {card.status}
                  </div>
                </div>
                <div className="overflow-hidden relative w-[150px] sm:w-[170px] my-0">
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
              <h2 className="text-xs font-medium text-[#111111] truncate max-w-full">{card.name}</h2>
              <div className="flex items-center justify-center gap-3 text-center text-[#5f6678] w-full">
                <div>
                  <div className="text-[8px]">{t("dashboardPages.cards.viewCard.customers")}</div>
                  <div className="text-[10px] font-medium text-[#111111]">{stats[card.cardId]?.customers ?? 0}</div>
                </div>
                <div>
                  <div className="text-[8px]">{t("dashboardPages.cards.points") || "النقاط"}</div>
                  <div className="text-[10px] font-medium text-[#111111]">{card.totalStages || stats[card.cardId]?.points || 0}</div>
                </div>
                <div>
                  <div className="text-[8px]">{t("dashboardPages.cards.viewCard.redeemedPoints") || "النقاط المستبدلة"}</div>
                  <div className="text-[10px] font-medium text-[#111111]">{stats[card.cardId]?.redeemed ?? 0}</div>
                </div>
              </div>
              <div className="px-4 py-1.5 rounded-2xl bg-[#7c88c4] text-white text-xs font-semibold">
                {t("dashboardPages.cards.manage") || "إدارة"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
