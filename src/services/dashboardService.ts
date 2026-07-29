import { apiClient } from "@/lib/api";
import type { DashboardStats, PeriodId } from "@/types/dashboard";

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const baseStats = {
  totalCustomers: 32,
  totalPoints: 12450,
  pointsSpent: 45230,
  rewardsRedeemed: 18,
  redeemedThisMonth: 3,
  redemptionRate: 24,
  activationRate: 68,
  inactiveCustomers: 8,
  inactivePercentage: 25,
  closeToReward: 5,
  needsPointsOrLess: 150,
};

const topCustomers = [
  { id: "1", name: "أحمد محمد", points: 1250, visits: 48 },
  { id: "2", name: "سارة علي", points: 980, visits: 36 },
  { id: "3", name: "خالد عمر", points: 720, visits: 29 },
  { id: "4", name: "نورة أحمد", points: 650, visits: 22 },
  { id: "5", name: "فيصل حسن", points: 480, visits: 18 },
];

const recentTransactions = [
  { customer: "أحمد محمد", action: "تسجيل نقاط", date: "منذ 5 دقائق", amount: "+50" },
  { customer: "سارة علي", action: "استبدال مكافأة", date: "منذ 15 دقائق", amount: "-200" },
  { customer: "خالد عمر", action: "تسجيل نقاط", date: "منذ 1 ساعة", amount: "+30" },
  { customer: "نورة أحمد", action: "تسجيل نقاط", date: "منذ 2 ساعات", amount: "+75" },
  { customer: "فيصل حسن", action: "استبدال مكافأة", date: "منذ 3 ساعات", amount: "-150" },
];

function generateChartData(period: PeriodId, start: string, end: string): { day: string; customers: number }[] {
  const s = new Date(start);
  const e = new Date(end);
  const diffDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000));

  let points: number;
  let labelFn: (i: number, total: number) => string;

  if (period === "day" || diffDays <= 7) {
    points = diffDays;
    labelFn = (i) => {
      const d = new Date(s);
      d.setDate(s.getDate() + i);
      return String(d.getDate());
    };
  } else if (period === "week" || diffDays <= 31) {
    points = 4;
    labelFn = (i) => `أ${i + 1}`;
  } else if (period === "year" || diffDays > 365) {
    points = 12;
    labelFn = (i) => String(i + 1);
  } else {
    points = Math.min(12, diffDays);
    labelFn = (i) => String(i + 1);
  }

  const seedBase = start.charCodeAt(0) + end.charCodeAt(end.length - 1);
  const data: { day: string; customers: number }[] = [];

  for (let i = 0; i < points; i++) {
    const val = Math.round(seededRandom(seedBase + i) * 35 + 5);
    data.push({ day: labelFn(i, points), customers: val });
  }

  if (data.length > 0) {
    data[data.length - 1].customers = 0;
  }

  return data;
}

function generateStatsForPeriod(period: PeriodId, start: string, end: string): DashboardStats {
  const s = new Date(start);
  const e = new Date(end);
  const diffDays = Math.max(1, Math.round((e.getTime() - s.getTime()) / 86400000));
  const multiplier = Math.max(0.1, diffDays / 30);
  const seed = start.length + end.length + period.charCodeAt(0);

  const factor = 0.85 + seededRandom(seed) * 0.3;

  return {
    totalCustomers: Math.round(baseStats.totalCustomers * (period === "all" ? 1 : factor)),
    totalPoints: Math.round(baseStats.totalPoints * multiplier * factor),
    pointsSpent: Math.round(baseStats.pointsSpent * multiplier * factor),
    rewardsRedeemed: Math.max(0, Math.round(baseStats.rewardsRedeemed * multiplier * factor)),
    redeemedThisMonth: Math.max(0, Math.round(baseStats.redeemedThisMonth * multiplier * factor)),
    redemptionRate: Math.round(Math.min(100, baseStats.redemptionRate * factor)),
    activationRate: Math.round(Math.min(100, baseStats.activationRate * factor)),
    inactiveCustomers: Math.round(baseStats.inactiveCustomers * factor),
    inactivePercentage: baseStats.inactivePercentage,
    closeToReward: baseStats.closeToReward,
    needsPointsOrLess: baseStats.needsPointsOrLess,
    topCustomers,
    recentTransactions,
    genderDistribution: { male: 0, female: 0 },
    chartData: generateChartData(period, start, end),
    newCustomers: Math.round(baseStats.totalCustomers * 0.375 * multiplier * factor),
    activeCustomers: Math.round(baseStats.totalCustomers * 0.625 * factor),
    totalCount: baseStats.totalCustomers,
    upFromLastMonth: seededRandom(seed + 999) > 0.5,
  };
}

export async function fetchDashboardStats(
  period: PeriodId,
  startDate: string,
  endDate: string
): Promise<DashboardStats> {
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    const params = new URLSearchParams({ period, startDate, endDate });
    return apiClient<DashboardStats>(`/api/dashboard/stats?${params}`);
  }

  await new Promise((r) => setTimeout(r, 300 + Math.random() * 400));
  return generateStatsForPeriod(period, startDate, endDate);
}
