import React, { useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useDirection } from "@/hooks/useDirection";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Coins, Gift, RefreshCw, TrendingUp, UserX, Award, BarChart3, Star, Clock, Scan, Copy } from "lucide-react";
import type { PeriodId } from "@/types/dashboard";

const cardClass = "border border-[#d4d9ef] rounded-2xl bg-white shadow-[0_4px_24px_rgba(124,136,196,.12)] transition-all duration-200 hover:shadow-[0_12px_48px_rgba(124,136,196,.26)] hover:-translate-y-1";

export function DashboardContent() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = React.useState<PeriodId>("month");
  const [startDate, setStartDate] = React.useState("2025-11-01");
  const [endDate, setEndDate] = React.useState("2025-11-07");

  const stats = useMemo(() => {
    const customers = JSON.parse(localStorage.getItem("registered_customers") || "[]") as any[];
    const cardMap = JSON.parse(localStorage.getItem("customer_card") || "{}");
    const ptsRaw = localStorage.getItem("customer_points");
    let ptsMap: Record<string, Record<string, number>> = {};
    try {
      if (ptsRaw) {
        const parsed = JSON.parse(ptsRaw);
        if (typeof parsed === "object" && !Array.isArray(parsed)) {
          const firstVal = Object.values(parsed)[0];
          if (typeof firstVal === "number") {
            const cm = JSON.parse(localStorage.getItem("customer_card") || "{}");
            const migrated: Record<string, Record<string, number>> = {};
            for (const [cid, pts] of Object.entries(parsed)) {
              const cardId = cm[cid] || "000-000-000-000";
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

    let totalPoints = 0;
    let activeCustomerIds = new Set<string>();
    const customerPtMap: Record<string, number> = {};
    for (const [, cardPts] of Object.entries(ptsMap)) {
      for (const [cid, pts] of Object.entries(cardPts)) {
        totalPoints += pts;
        customerPtMap[cid] = (customerPtMap[cid] || 0) + pts;
        if (pts > 0) activeCustomerIds.add(cid);
      }
    }

    const totalCustomers = customers.length;
    const activeCount = activeCustomerIds.size;
    const inactiveCount = totalCustomers - activeCount;
    const activationRate = totalCustomers > 0 ? Math.round((activeCount / totalCustomers) * 100) : 0;

    const auditRaw = localStorage.getItem("audit_logs") || "[]";
    const audit: any[] = JSON.parse(auditRaw);
    const redeemedEvents = audit.filter((e: any) =>
      e.event?.includes("استبدل") || e.event?.includes("Redeemed")
    );
    const rewardsRedeemed = redeemedEvents.length;

    const topList = Object.entries(customerPtMap)
      .map(([cid, pts]) => {
        const c = customers.find((c: any) => String(c.id) === cid);
        return { id: cid, name: c?.fullName || `#${cid}`, points: pts, visits: 0 };
      })
      .sort((a, b) => b.points - a.points)
      .slice(0, 5);

    const customerNameToId: Record<string, string> = {};
    for (const c of customers) {
      customerNameToId[c.fullName] = String(c.id);
    }

    const recentTransactions = audit.slice(0, 5).map((e: any) => {
      const isGrant = e.event?.includes("منح") || e.event?.includes("Granted");
      const amount = e.cashbackStamps || 0;
      return {
        customer: e.customerName,
        action: e.event,
        amount: isGrant ? `+${amount}` : `-${amount}`,
        date: e.createdAt,
      };
    });

    const redemptionRate = totalPoints > 0 ? Math.round((rewardsRedeemed / totalPoints) * 100) : 0;
    const avgPoints = totalCustomers > 0 ? Math.round(totalPoints / totalCustomers) : 0;
    const closeToReward = topList.filter(c => c.points >= 3).length;

    const chartData = [
      { day: "السبت", customers: Math.max(0, activeCount - 2) },
      { day: "الأحد", customers: Math.max(0, activeCount - 1) },
      { day: "الإثنين", customers: activeCount },
      { day: "الثلاثاء", customers: Math.max(0, activeCount - 1) },
      { day: "الأربعاء", customers: Math.max(0, activeCount + 1) },
      { day: "الخميس", customers: activeCount },
      { day: "الجمعة", customers: Math.max(0, activeCount - 3) },
    ];

    return {
      totalCustomers,
      totalPoints,
      pointsSpent: rewardsRedeemed,
      rewardsRedeemed,
      redeemedThisMonth: rewardsRedeemed,
      redemptionRate,
      upFromLastMonth: rewardsRedeemed > 0,
      totalCount: totalCustomers,
      newCustomers: Math.min(totalCustomers, 3),
      activeCustomers: activeCount,
      chartData,
      activationRate,
      inactiveCustomers: inactiveCount,
      inactivePercentage: totalCustomers > 0 ? Math.round((inactiveCount / totalCustomers) * 100) : 0,
      closeToReward,
      needsPointsOrLess: Math.max(0, closeToReward - 1),
      topCustomers: topList,
      recentTransactions,
      topCustomer: topList[0] || null,
    };
  }, [activePeriod, startDate, endDate]);
  const firstCardId = useMemo(() => {
    try {
      const raw = localStorage.getItem("dashboard_cards");
      const list: any[] = raw ? JSON.parse(raw) : [];
      return list[0]?.cardId || "000-000-000-000";
    } catch { return "000-000-000-000"; }
  }, []);
  const registrationUrl = `${window.location.origin}/customer/register?card=${firstCardId}`;

  const copyQrLink = () => {
    navigator.clipboard.writeText(registrationUrl);
    toast.success(t("dashboard.content.charts.linkCopied"));
  };

  const periods = [
    { id: "day", label: t("dashboard.content.periods.day") },
    { id: "week", label: t("dashboard.content.periods.week") },
    { id: "month", label: t("dashboard.content.periods.month") },
    { id: "year", label: t("dashboard.content.periods.year") },
    { id: "all", label: t("dashboard.content.periods.allTime") },
  ];

  return (
    <div className="px-6 py-4 w-full min-h-screen bg-[#f2f3f8]" dir={isRTL ? "rtl" : "rtl"}>
      <div className="w-full flex flex-wrap items-center justify-between mb-5 gap-3">
        <h1 className="text-xl font-semibold text-gray-800">{t("dashboard.content.title")}</h1>
        <div className="flex items-center gap-2 flex-wrap">
          {periods.map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => setActivePeriod(period.id)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                activePeriod === period.id
                  ? "bg-[#7c88c4] text-white border-[#7c88c4] shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-[#A6AFD8] hover:shadow-sm"
              }`}
            >
              <span>{period.label}</span>
            </button>
          ))}
          <div className="w-[220px]">
            <div className="flex items-center justify-between gap-1 border border-gray-200 rounded-lg px-3 py-1.5 bg-white shadow-sm">
              <input
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                className="w-1/2 border-none focus:outline-none text-xs text-gray-700 bg-transparent"
              />
              <span className="text-gray-400 text-xs">إلى</span>
              <input
                type="date"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
                className="w-1/2 border-none focus:outline-none text-xs text-gray-700 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>

      {!stats ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#7c88c4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
        <div className="grid grid-cols-4 gap-4">
          <Card className={cardClass}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-[#eef0f8]">
                  <Users className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t("dashboard.content.charts.totalCustomers")}</span>
              </div>
              <span className="text-3xl font-bold text-[#3d4257]">{stats?.totalCustomers ?? "—"}</span>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-[#eef0f8]">
                  <Coins className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t("dashboard.content.charts.totalPoints")}</span>
              </div>
              <span className="text-3xl font-bold text-[#3d4257]">{stats?.totalPoints.toLocaleString() ?? "—"}</span>
              <p className="text-xs text-gray-400 mt-1.5">{stats?.pointsSpent.toLocaleString() ?? "—"} {t("dashboard.content.charts.pointsSpent")}</p>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-[#eef0f8]">
                  <Gift className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t("dashboard.content.charts.rewardsRedeemed")}</span>
              </div>
              <span className="text-3xl font-bold text-[#3d4257]">{stats?.rewardsRedeemed ?? "—"}</span>
              <p className="text-xs text-gray-400 mt-1.5">{stats?.redeemedThisMonth ?? "—"} {t("dashboard.content.charts.redeemedThisMonth")}</p>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-[#eef0f8]">
                  <RefreshCw className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t("dashboard.content.charts.redemptionRate")}</span>
              </div>
              <span className="text-3xl font-bold text-[#3d4257]">{stats?.redemptionRate ?? "—"}%</span>
              <p className="text-xs text-emerald-600 mt-1.5">{stats?.upFromLastMonth ? t("dashboard.content.charts.upFromLastMonth") : t("dashboard.content.charts.downFromLastMonth")}</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className={`${cardClass} col-span-4`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#eef0f8]">
                    <Users className="w-5 h-5 text-[#7c88c4]" />
                  </div>
                  <span className="text-base font-semibold text-gray-800">{t("dashboard.content.charts.newCustomers")}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-lg">{stats?.totalCount ?? "—"}</div>
                    <div className="text-[11px] text-gray-500">{t("dashboard.content.charts.totalCountShort")}</div>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center">
                    <div className="font-bold text-emerald-600 text-lg">{stats?.newCustomers ?? "—"}</div>
                    <div className="text-[11px] text-gray-500">{t("dashboard.content.charts.newCustomersShort")}</div>
                  </div>
                  <div className="w-px h-8 bg-gray-100" />
                  <div className="text-center">
                    <div className="font-bold text-gray-900 text-lg">{stats?.activeCustomers ?? "—"}</div>
                    <div className="text-[11px] text-gray-500">{t("dashboard.content.charts.activeCustomersShort")}</div>
                  </div>
                </div>
              </div>
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats?.chartData ?? []}>
                    <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                    <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                    <YAxis stroke="#9ca3af" tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                    <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e5e7eb" }} labelStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="customers" stroke="#7c88c4" strokeWidth={2.5} dot={{ r: 3, strokeWidth: 2, fill: "#fff" }} activeDot={{ r: 5, fill: "#7c88c4" }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className={cardClass}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-[#eef0f8]">
                  <TrendingUp className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t("dashboard.content.charts.activationRate")}</span>
              </div>
              <span className="text-3xl font-bold text-[#3d4257]">{stats?.activationRate ?? "—"}%</span>
              <p className="text-xs text-red-500 mt-1.5">{stats?.upFromLastMonth ? t("dashboard.content.charts.upFromLastMonth") : t("dashboard.content.charts.downFromLastMonth")}</p>
            </CardContent>
          </Card>
          <Card
            className={`${cardClass} cursor-pointer`}
            onClick={() => navigate("/dashboard/customers")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-[#eef0f8]">
                  <UserX className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t("dashboard.content.charts.inactiveCustomers")}</span>
              </div>
              <span className="text-3xl font-bold text-[#3d4257]">{stats?.inactiveCustomers ?? "—"}</span>
              <p className="text-xs text-red-500 mt-1.5">{stats?.inactivePercentage ?? "—"}% {t("dashboard.content.charts.ofTotalCustomers")}</p>
            </CardContent>
          </Card>
          <Card
            className={`${cardClass} cursor-pointer`}
            onClick={() => navigate("/dashboard/customers")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-[#eef0f8]">
                  <Award className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t("dashboard.content.charts.closeToReward")}</span>
              </div>
              <span className="text-3xl font-bold text-[#3d4257]">{stats?.closeToReward ?? "—"}</span>
              <p className="text-xs text-orange-500 mt-1.5">{stats?.needsPointsOrLess ?? "—"} {t("dashboard.content.charts.needsPointsOrLess")}</p>
            </CardContent>
          </Card>
          <Card className={cardClass}>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2.5 rounded-lg bg-[#eef0f8]">
                  <BarChart3 className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-sm font-medium text-gray-600">{t("dashboard.content.charts.genderDistribution")}</span>
              </div>
              <div className="space-y-3 mt-3">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{t("dashboard.content.charts.male")}<span className="text-gray-400 mr-2">0%</span></span>
                  </div>
                  <div className="w-full rounded-full h-2.5 bg-[#f2f3f8]">
                    <div className="h-full rounded-full bg-[#7c88c4]" style={{ width: "0%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{t("dashboard.content.charts.female")}<span className="text-gray-400 mr-2">0%</span></span>
                  </div>
                  <div className="w-full rounded-full h-2.5 bg-[#f2f3f8]">
                    <div className="h-full rounded-full bg-[#5a68b0]" style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card className={`col-span-2 ${cardClass}`}>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Scan className="w-5 h-5 text-[#7c88c4]" />
                <span className="text-base font-semibold text-gray-800">{t("dashboard.content.charts.qrCode")}</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 rounded-xl bg-[#eef0f8]">
                  <QRCodeCanvas value={registrationUrl} size={130} bgColor="#ffffff" fgColor="#000000" level="M" />
                </div>
                <p className="text-xs text-gray-400 text-center break-all max-w-full">{registrationUrl}</p>
                <button
                  onClick={copyQrLink}
                  className="inline-flex items-center gap-1.5 text-sm text-white bg-[#7c88c4] hover:bg-[#5a68b0] px-5 py-2.5 rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  {t("dashboard.content.charts.copyLink")}
                </button>
              </div>
            </CardContent>
          </Card>
          <Card className={`${cardClass} col-span-2`}>
            <CardHeader className="py-4 px-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#eef0f8]">
                  <Star className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-base font-semibold text-gray-800">{t("dashboard.content.charts.topCustomers")}</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <div className="space-y-1">
                {stats?.topCustomers?.map((c, i) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 hover:bg-[#f2f3f8] px-2 -mx-2 rounded-lg transition-colors cursor-pointer"
                    onClick={() => navigate(`/dashboard/customers/view/${c.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-[#7c88c4]" : i === 1 ? "bg-[#A6AFD8]" : i === 2 ? "bg-[#5a68b0]" : "bg-gray-200 text-gray-600"}`}>{i + 1}</span>
                      <span className="text-sm font-medium text-gray-700">{c.name}</span>
                    </div>
                    <div className="flex gap-5 text-xs text-gray-500">
                      <span>{c.points} {t("dashboard.content.charts.pointsLabel")}</span>
                      <span>{c.visits} {t("dashboard.content.charts.visitsLabel")}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <Card
            className={`${cardClass} col-span-4 cursor-pointer`}
            onClick={() => navigate("/dashboard/cards")}
          >
            <CardHeader className="py-4 px-6 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#eef0f8]">
                  <Clock className="w-5 h-5 text-[#7c88c4]" />
                </div>
                <span className="text-base font-semibold text-gray-800">{t("dashboard.content.charts.recentTransactions")}</span>
              </div>
            </CardHeader>
            <CardContent className="px-6 py-4">
              <div className="grid grid-cols-5 gap-4">
                {stats?.recentTransactions?.map((tx, i) => (
                  <div key={i} className="flex flex-col items-center gap-1.5 py-2 border-l border-gray-100 last:border-0">
                    <span className="text-sm font-medium text-gray-700">{tx.customer}</span>
                    <span className="text-xs text-gray-400 bg-[#f2f3f8] px-2 py-0.5 rounded">{tx.action}</span>
                    <span className={`text-sm font-semibold ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>{tx.amount}</span>
                    <span className="text-[10px] text-gray-400">{tx.date}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      )}
    </div>
  );
}
