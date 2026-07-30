import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Trash2, Download, Copy, Users, Coins, Gift, RefreshCw, TrendingUp, UserX, Award, BarChart3, Star, Clock, Scan } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QRCodeCanvas } from "qrcode.react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "react-i18next";
import { useDirection } from "@/hooks/useDirection";

const cardClass = "border border-[#e5e7eb] rounded-xl bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]";

export function ViewCardPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadCard = () => {
      const savedCards = JSON.parse(localStorage.getItem("dashboard_cards") || "[]");
      const defaultCards = [
        { id: 1, name: "نادي اللياقة النخبة", title: "تدرب وادخر", description: "استمتع بمرافقنا الفاخرة واحصل على مكافآت حصرية!", cardId: "477-398-475-609", issueDate: new Date("2025-07-08").toISOString(), expiryDate: new Date("2027-08-30").toISOString(), bgColor: "#3498DB", bgOpacity: 0.87, bgImage: "", textColor: "#ffffff", status: "نشط", currentStage: 2, totalStages: 5 },

      ];
      const allCards = [...defaultCards, ...savedCards];
      const foundCard = allCards.find((c) => c.id.toString() === id || c.id === Number(id));
      if (foundCard) {
        setCard({
          ...foundCard,
          issueDate: foundCard.issueDate ? new Date(foundCard.issueDate) : new Date(),
          expiryDate: foundCard.expiryDate ? new Date(foundCard.expiryDate) : null,
        });
      } else {
        toast.error(t("common.error"));
        navigate("/dashboard/cards");
      }
      setLoading(false);
    };
    loadCard();
  }, [id, navigate, t]);

  const confirmDelete = () => {
    const savedCards = JSON.parse(localStorage.getItem("dashboard_cards") || "[]");
    const updatedCards = savedCards.filter((c: any) => c.id.toString() !== id && c.id !== Number(id));
    localStorage.setItem("dashboard_cards", JSON.stringify(updatedCards));
    toast.success(t("common.success"));
    setDeleteDialogOpen(false);
    navigate("/dashboard/cards");
  };

  const copyQrLink = () => {
    navigator.clipboard.writeText(cardUrl);
    setCopied(true);
    toast.success(t("common.success"));
    setTimeout(() => setCopied(false), 2000);
  };

  const cardStats = useMemo(() => {
    if (!card) return { totalCustomers: 0, totalPoints: 0, totalRedeemed: 0, avgPoints: 0, closeToReward: 0, topList: [], activationRate: 0, activeCount: 0, inactiveCount: 0, inactivePct: 0 };
    const cusRaw = localStorage.getItem("registered_customers") || "[]";
    const allCustomers: any[] = JSON.parse(cusRaw);
    const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");
    const ptsRaw = localStorage.getItem("customer_points");
    let ptsMap: Record<string, Record<string, number>> = {};
    try {
      if (ptsRaw) {
        const parsed = JSON.parse(ptsRaw);
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
    const cardPts = ptsMap[card.cardId] || {};

    const linkedFromCardMap = Object.entries(cardMap)
      .filter(([, v]) => v === card.cardId)
      .map(([k]) => k);
    const ptsCustomerIds = Object.keys(cardPts);
    const linkedIds = [...new Set([...linkedFromCardMap, ...ptsCustomerIds])];

    const totalCustomers = linkedIds.length;

    const customerNameToId: Record<string, string> = {};
    for (const c of allCustomers) {
      customerNameToId[c.fullName] = String(c.id);
    }

    const auditRaw = localStorage.getItem("audit_logs") || "[]";
    const audit: any[] = JSON.parse(auditRaw);
    const cardAudit = audit.filter((e: any) => {
      const cid = customerNameToId[e.customerName];
      return cid && linkedIds.includes(cid);
    });
    const redeemed = cardAudit.filter((e: any) =>
      e.event?.includes("استبدل") || e.event?.includes("Redeemed")
    );
    const totalRedeemed = redeemed.length;

    let totalPoints = 0;
    const topList: { name: string; points: number }[] = [];
    for (const cid of linkedIds) {
      const pts = cardPts[cid] || 0;
      totalPoints += pts;
      const cus = allCustomers.find((c: any) => String(c.id) === cid);
      topList.push({ name: cus?.fullName || `#${cid}`, points: pts });
    }
    topList.sort((a, b) => b.points - a.points);

    const avgPoints = totalCustomers > 0 ? Math.round(totalPoints / totalCustomers) : 0;
    const closeToReward = topList.filter(c => c.points >= (card.totalStages || 1) * 0.75).length;
    const activeCount = topList.filter(c => c.points > 0).length;
    const activationRate = totalCustomers > 0 ? Math.round((activeCount / totalCustomers) * 100) : 0;
    const inactiveCount = totalCustomers - activeCount;
    const inactivePct = totalCustomers > 0 ? Math.round((inactiveCount / totalCustomers) * 100) : 0;

    return { totalCustomers, totalPoints, totalRedeemed, avgPoints, closeToReward, topList, activationRate, activeCount, inactiveCount, inactivePct };
  }, [card]);

  const recentTransactions = useMemo(() => {
    if (!card) return [];
    try {
      const auditRaw = localStorage.getItem("audit_logs") || "[]";
      const audit: any[] = JSON.parse(auditRaw);
      const cusRaw = localStorage.getItem("registered_customers") || "[]";
      const allCustomers: any[] = JSON.parse(cusRaw);
      const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");

      const linkedFromCardMap = Object.entries(cardMap)
        .filter(([, v]) => v === card.cardId)
        .map(([k]) => k);
      const linkedIds = new Set(linkedFromCardMap);

      const customerNameToId: Record<string, string> = {};
      for (const c of allCustomers) {
        customerNameToId[c.fullName] = String(c.id);
      }

      return audit
        .filter((e: any) => {
          const cid = customerNameToId[e.customerName];
          return cid && linkedIds.has(cid);
        })
        .slice(0, 10)
        .map((e: any) => {
          const isGrant = e.event?.includes("منح") || e.event?.includes("Granted");
          const amount = e.cashbackStamps || 0;
          return {
            customer: e.customerName,
            action: e.event,
            amount: isGrant ? `+${amount}` : `-${amount}`,
            date: e.createdAt,
          };
        });
    } catch {
      return [];
    }
  }, [card]);

  if (loading || !card) {
    return (
      <div className="px-4 py-3 w-full min-h-screen bg-[#fafbff] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#7c88c4] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cardUrl = `${window.location.origin}/customer/register?card=${card.cardId || "000-000-000-000"}`;

  const topCustomers = cardStats.topList.slice(0, 5);

  return (
    <div className="px-4 py-3 w-full min-h-screen bg-[#fafbff]" dir={isRTL ? "rtl" : "rtl"}>
      <div className="w-full flex flex-wrap items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-[#f7f9ff]">
            <Award className="w-4 h-4 text-[#7c88c4]" />
          </div>
          <div>
            <h1 className="text-lg font-medium text-[#111111]">{card.name}</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Badge className="bg-[#f7f9ff] text-[#7c88c4] hover:bg-[#f7f9ff] border-0 text-[10px] font-medium">
                {card.status || t("dashboardPages.cards.active")}
              </Badge>
              <span className="text-[10px] text-[#5f6678]">ID: {card.cardId || card.id}</span>
              <span className="text-[10px] text-[#dde1ee]">|</span>
              <span className="text-[10px] text-[#5f6678]">{card.issueDate ? format(card.issueDate, "dd MMM yyyy", { locale: ar }) : ""}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => navigate("/dashboard/cards")}
            className="text-[10px] px-2.5 py-1 rounded-lg border transition-all bg-white text-[#5f6678] border-[#dde1ee] hover:border-[#A6AFD8] hover:shadow-sm font-medium"
          >
            {t("common.back")}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/dashboard/cards/edit/${card.id}`)}
            className="text-[10px] px-2.5 py-1 rounded-lg border transition-all bg-white text-[#5f6678] border-[#dde1ee] hover:border-[#A6AFD8] hover:shadow-sm font-medium"
          >
            {t("common.edit")}
          </button>
          <button
            type="button"
            onClick={() => setDeleteDialogOpen(true)}
            className="text-[10px] px-2.5 py-1 rounded-lg border border-red-200 text-red-500 bg-white hover:bg-red-50 transition-all font-medium"
          >
            <Trash2 className="w-3 h-3 inline ml-1" />
            {t("common.delete")}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Row 1: 4 KPI cards */}
        <div className="grid grid-cols-4 gap-3">
          <Card className={cardClass}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Users className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.stats.totalCustomers")}</span>
              </div>
              <span className="text-lg font-bold text-[#111111]">{cardStats.totalCustomers}</span>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Coins className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.totalPoints")}</span>
              </div>
              <span className="text-lg font-bold text-[#111111]">{cardStats.totalPoints}</span>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Gift className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.rewardsRedeemed")}</span>
              </div>
              <span className="text-lg font-bold text-[#111111]">{cardStats.totalRedeemed}</span>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <RefreshCw className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.redemptionRate")}</span>
              </div>
              <span className="text-lg font-bold text-[#111111]">{cardStats.totalRedeemed > 0 ? Math.round((cardStats.totalRedeemed / Math.max(cardStats.totalPoints, 1)) * 100) : 0}%</span>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: 4 stats cards */}
        <div className="grid grid-cols-4 gap-3">
          <Card className={cardClass}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <TrendingUp className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.activationRate")}</span>
              </div>
              <span className="text-lg font-bold text-[#111111]">{cardStats.activationRate}%</span>
              <p className="text-[9px] text-[#5f6678] mt-0.5">{cardStats.activeCount} {t("dashboard.content.charts.activeCustomersShort")}</p>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <UserX className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.inactiveCustomers")}</span>
              </div>
              <span className="text-lg font-bold text-[#111111]">{cardStats.inactiveCount}</span>
              <p className="text-[9px] text-red-500 mt-0.5">{cardStats.inactivePct}% {t("dashboard.content.charts.ofTotalCustomers")}</p>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <BarChart3 className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboardPages.cards.avgPointsPerCustomer")}</span>
              </div>
              <span className="text-lg font-bold text-[#111111]">{cardStats.avgPoints}</span>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-3">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Award className="w-3.5 h-3.5 text-[#7c88c4]" />
                </div>
                <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.closeToReward")}</span>
              </div>
              <span className="text-lg font-bold text-[#111111]">{cardStats.closeToReward}</span>
              <p className="text-[9px] text-orange-500 mt-0.5">{"≥ 75%"}</p>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: QR Code - full width */}
        <div className="grid grid-cols-4 gap-3">
          <Card className={`${cardClass} col-span-4`}>
            <CardHeader className="py-2.5 px-3 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Scan className="w-4 h-4 text-[#7c88c4]" />
                </div>
                <span className="text-xs font-medium text-[#111111]">{t("dashboard.content.charts.qrCode") + " " + (t("dashboardPages.cards.viewCard.forCustomers") || "لتسجيل العملاء")}</span>
              </div>
            </CardHeader>
            <CardContent className="px-3 py-3">
              <div className="flex flex-col items-center gap-2">
                <div className="p-3 rounded-lg bg-[#f7f9ff]">
                  <QRCodeCanvas value={cardUrl} size={110} bgColor="#ffffff" fgColor="#000000" level="M" />
                </div>
                <p className="text-[9px] text-[#5f6678] text-center break-all max-w-full">{cardUrl}</p>
                <button
                  onClick={copyQrLink}
                  className="inline-flex items-center gap-1 text-xs text-white bg-[#7c88c4] hover:bg-[#5a68b0] px-3 py-1.5 rounded-lg transition-colors font-medium"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? (t("dashboardPages.cards.viewCard.copied") || "تم النسخ") : (t("dashboardPages.cards.viewCard.copyLink") || "نسخ رابط التسجيل")}
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 4: Top Customers - full width */}
        <div className="grid grid-cols-4 gap-3">
          <Card className={`${cardClass} col-span-4`}>
            <CardHeader className="py-2.5 px-3 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Star className="w-4 h-4 text-[#7c88c4]" />
                </div>
                <span className="text-xs font-medium text-[#111111]">{t("dashboard.content.charts.topCustomers")}</span>
              </div>
            </CardHeader>
            <CardContent className="px-3 py-2.5">
              {topCustomers.length === 0 ? (
                <div className="text-xs text-[#5f6678] text-center py-6">{t("dashboardPages.cards.noCustomersData")}</div>
              ) : (
                topCustomers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[#e5e7eb] last:border-0 px-1.5 rounded-lg transition-colors cursor-pointer hover:bg-[#f7f9ff]">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium text-white ${i === 0 ? "bg-[#7c88c4]" : i === 1 ? "bg-[#A6AFD8]" : i === 2 ? "bg-[#5a68b0]" : "bg-gray-200 text-[#5f6678]"}`}>{i + 1}</span>
                      <span className="text-xs font-medium text-[#111111]">{c.name}</span>
                    </div>
                    <div className="flex gap-3 text-[10px] text-[#5f6678]">
                      <span>{c.points} {t("dashboard.content.charts.pointsLabel")}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Row 5: Recent Transactions */}
        <div className="grid grid-cols-4 gap-3">
          <Card className={`${cardClass} col-span-4`}>
            <CardHeader className="py-2.5 px-3 border-b border-[#e5e7eb]">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                  <Clock className="w-4 h-4 text-[#7c88c4]" />
                </div>
                <span className="text-xs font-medium text-[#111111]">{t("dashboard.content.charts.recentTransactions")}</span>
              </div>
            </CardHeader>
            <CardContent className="px-3 py-2.5">
              <div className="grid grid-cols-5 gap-2">
                {recentTransactions.map((tx, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 py-1.5 border-l border-[#e5e7eb] last:border-0">
                    <span className="text-xs font-medium text-[#111111]">{tx.customer}</span>
                    <span className="text-[9px] text-[#5f6678] bg-[#f7f9ff] px-1.5 py-0.5 rounded">{tx.action}</span>
                    <span className={`text-[10px] font-medium ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>{tx.amount}</span>
                    <span className="text-[8px] text-[#5f6678]">{tx.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir={isRTL ? "rtl" : "ltr"}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("dashboardPages.deleteConfirmation.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("dashboardPages.deleteConfirmation.descriptionWithName", {
                item: t("dashboardPages.cards.title"),
                name: card.name || card.title || ""
              })}
              <br />
              <span className="text-xs text-muted-foreground mt-2 block">
                {t("dashboardPages.deleteConfirmation.warning")}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{t("dashboardPages.deleteConfirmation.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              {t("dashboardPages.deleteConfirmation.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
