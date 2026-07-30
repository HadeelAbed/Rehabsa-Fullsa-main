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

const cardClass = "border border-[#e5e7eb] rounded-xl bg-white shadow-sm";

export function DashboardContent() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = React.useState<PeriodId>("month");
  const [startDate, setStartDate] = React.useState("2025-11-01");
  const [endDate, setEndDate] = React.useState("2025-11-07");

  const stats = useMemo(() => {
    const customers = JSON.parse(localStorage.getItem("registered_customers") || "[]") as any[];
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
    <div className="p-3 md:p-4 w-full min-h-screen bg-[#fafbff]" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h1 className="text-base font-semibold text-[#111111]">{t("dashboard.content.title")}</h1>
          <p className="text-[10px] text-[#5f6678] mt-0.5">{t("dashboard.welcome")}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {periods.map((period) => (
            <button
              key={period.id}
              type="button"
              onClick={() => setActivePeriod(period.id)}
              className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all ${
                activePeriod === period.id
                  ? "bg-[#7c88c4] text-white border-[#7c88c4]"
                  : "bg-white text-[#5f6678] border-[#dde1ee] hover:border-[#7c88c4]"
              }`}
            >
              {period.label}
            </button>
          ))}
          <div className="flex items-center gap-1 border border-[#dde1ee] rounded-lg px-2 py-1 bg-white">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-[72px] border-none focus:outline-none text-[10px] bg-transparent text-[#111111]" />
            <span className="text-[#5f6678] text-[10px]">{isRTL ? "إلى" : "to"}</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-[72px] border-none focus:outline-none text-[10px] bg-transparent text-[#111111]" />
          </div>
        </div>
      </div>

      {!stats ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-4 border-[#7c88c4] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className={cardClass}>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1.5 rounded-lg bg-[#f7f9ff]">
                    <Users className="w-3.5 h-3.5 text-[#7c88c4]" />
                  </div>
                  <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.totalCustomers")}</span>
                </div>
                <span className="text-lg font-bold text-[#111111]">{stats?.totalCustomers ?? "—"}</span>
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
                <span className="text-lg font-bold text-[#111111]">{stats?.totalPoints.toLocaleString() ?? "—"}</span>
                <p className="text-[9px] text-[#5f6678] mt-0.5">{stats?.pointsSpent.toLocaleString() ?? "—"} {t("dashboard.content.charts.pointsSpent")}</p>
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
                <span className="text-lg font-bold text-[#111111]">{stats?.rewardsRedeemed ?? "—"}</span>
                <p className="text-[9px] text-[#5f6678] mt-0.5">{stats?.redeemedThisMonth ?? "—"} {t("dashboard.content.charts.redeemedThisMonth")}</p>
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
                <span className="text-lg font-bold text-[#111111]">{stats?.redemptionRate ?? "—"}%</span>
              </CardContent>
            </Card>
          </div>

          {/* Customer Growth Chart */}
          <div className="grid grid-cols-1 gap-3">
            <Card className={cardClass}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#7c88c4]" />
                    <span className="text-xs font-medium text-[#111111]">{t("dashboard.content.charts.newCustomers")}</span>
                  </div>
                  <div className="flex items-center gap-3 text-center">
                    <div>
                      <div className="font-bold text-xs text-[#111111]">{stats?.totalCount ?? "—"}</div>
                      <div className="text-[9px] text-[#5f6678]">{t("dashboard.content.charts.totalCountShort")}</div>
                    </div>
                    <div className="w-px h-5 bg-[#e5e7eb]" />
                    <div>
                      <div className="font-bold text-xs text-emerald-600">{stats?.newCustomers ?? "—"}</div>
                      <div className="text-[9px] text-[#5f6678]">{t("dashboard.content.charts.newCustomersShort")}</div>
                    </div>
                    <div className="w-px h-5 bg-[#e5e7eb]" />
                    <div>
                      <div className="font-bold text-xs text-[#111111]">{stats?.activeCustomers ?? "—"}</div>
                      <div className="text-[9px] text-[#5f6678]">{t("dashboard.content.charts.activeCustomersShort")}</div>
                    </div>
                  </div>
                </div>
                <div className="h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats?.chartData ?? []}>
                      <CartesianGrid stroke="#f0f0f0" strokeDasharray="3 3" />
                      <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 9 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                      <YAxis stroke="#9ca3af" tick={{ fontSize: 9 }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
                      <Tooltip contentStyle={{ fontSize: 10, borderRadius: 8, border: "1px solid #e5e7eb" }} labelStyle={{ fontSize: 10 }} />
                      <Line type="monotone" dataKey="customers" stroke="#7c88c4" strokeWidth={2} dot={{ r: 2.5, fill: "#7c88c4" }} activeDot={{ r: 4, fill: "#7c88c4" }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mini Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className={cardClass}>
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-[#7c88c4]" />
                  <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.activationRate")}</span>
                </div>
                <span className="text-base font-bold text-[#111111]">{stats?.activationRate ?? "—"}%</span>
                <p className="text-[9px] text-emerald-600 mt-0.5">{stats?.upFromLastMonth ? t("dashboard.content.charts.upFromLastMonth") : t("dashboard.content.charts.downFromLastMonth")}</p>
              </CardContent>
            </Card>
            <Card className={`${cardClass} cursor-pointer`} onClick={() => navigate("/dashboard/customers")}>
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <UserX className="w-3.5 h-3.5 text-[#7c88c4]" />
                  <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.inactiveCustomers")}</span>
                </div>
                <span className="text-base font-bold text-[#111111]">{stats?.inactiveCustomers ?? "—"}</span>
                <p className="text-[9px] text-red-500 mt-0.5">{stats?.inactivePercentage ?? "—"}% {t("dashboard.content.charts.ofTotalCustomers")}</p>
              </CardContent>
            </Card>
            <Card className={`${cardClass} cursor-pointer`} onClick={() => navigate("/dashboard/customers")}>
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Award className="w-3.5 h-3.5 text-[#7c88c4]" />
                  <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.closeToReward")}</span>
                </div>
                <span className="text-base font-bold text-[#111111]">{stats?.closeToReward ?? "—"}</span>
                <p className="text-[9px] text-orange-500 mt-0.5">{stats?.needsPointsOrLess ?? "—"} {t("dashboard.content.charts.needsPointsOrLess")}</p>
              </CardContent>
            </Card>
            <Card className={cardClass}>
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-[#7c88c4]" />
                  <span className="text-[10px] font-medium text-[#5f6678]">{t("dashboard.content.charts.genderDistribution")}</span>
                </div>
                <div className="space-y-1.5">
                  <div>
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span className="text-[#5f6678]">{t("dashboard.content.charts.male")}<span className="mr-1 text-[#5f6678]">0%</span></span>
                    </div>
                    <div className="w-full rounded-full h-1.5 bg-[#f7f9ff]">
                      <div className="h-full rounded-full bg-[#7c88c4]" style={{ width: "0%" }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[9px] mb-0.5">
                      <span className="text-[#5f6678]">{t("dashboard.content.charts.female")}<span className="mr-1 text-[#5f6678]">0%</span></span>
                    </div>
                    <div className="w-full rounded-full h-1.5 bg-[#f7f9ff]">
                      <div className="h-full rounded-full bg-[#5a68b0]" style={{ width: "0%" }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QR + Top Customers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Card className={cardClass}>
              <CardContent className="p-3">
                <div className="flex items-center gap-1.5 mb-2">
                  <Scan className="w-3.5 h-3.5 text-[#7c88c4]" />
                  <span className="text-xs font-medium text-[#111111]">{t("dashboard.content.charts.qrCode")}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="p-2.5 rounded-lg bg-[#f7f9ff]">
                    <QRCodeCanvas value={registrationUrl} size={110} bgColor="#ffffff" fgColor="#000000" level="M" />
                  </div>
                  <p className="text-[9px] text-[#5f6678] text-center break-all max-w-full">{registrationUrl}</p>
                  <button onClick={copyQrLink} className="inline-flex items-center gap-1 text-[10px] text-white bg-[#7c88c4] hover:bg-[#5a68b0] px-3 py-1.5 rounded-lg transition-colors font-medium">
                    <Copy className="w-3 h-3" />
                    {t("dashboard.content.charts.copyLink")}
                  </button>
                </div>
              </CardContent>
            </Card>
            <Card className={cardClass}>
              <CardHeader className="px-3 py-2 border-b border-[#e5e7eb]">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-[#7c88c4]" />
                  <span className="text-xs font-medium text-[#111111]">{t("dashboard.content.charts.topCustomers")}</span>
                </div>
              </CardHeader>
              <CardContent className="px-3 py-2">
                <div className="space-y-0.5">
                  {stats?.topCustomers?.map((c, i) => (
                    <div key={c.id} className="flex items-center justify-between py-1.5 border-b border-[#e5e7eb] last:border-0 hover:bg-[#f7f9ff] px-1.5 -mx-1.5 rounded-lg transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/customers/view/${c.id}`)}>
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-medium text-white ${i === 0 ? "bg-[#7c88c4]" : i === 1 ? "bg-[#A6AFD8]" : i === 2 ? "bg-[#5a68b0]" : "bg-gray-200 text-[#5f6678]"}`}>{i + 1}</span>
                        <span className="text-xs font-medium text-[#111111]">{c.name}</span>
                      </div>
                      <div className="flex gap-2 text-[10px] text-[#5f6678]">
                        <span>{c.points} {t("dashboard.content.charts.pointsLabel")}</span>
                        <span>{c.visits} {t("dashboard.content.charts.visitsLabel")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div className="grid grid-cols-1 gap-3">
            <Card className={`${cardClass} cursor-pointer`} onClick={() => navigate("/dashboard/cards")}>
              <CardHeader className="px-3 py-2 border-b border-[#e5e7eb]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#7c88c4]" />
                  <span className="text-xs font-medium text-[#111111]">{t("dashboard.content.charts.recentTransactions")}</span>
                </div>
              </CardHeader>
              <CardContent className="px-3 py-2">
                <div className="grid grid-cols-5 gap-2">
                  {stats?.recentTransactions?.map((tx, i) => (
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
      )}
    </div>
  );
}
