export interface TopCustomer {
  id: string;
  name: string;
  points: number;
  visits: number;
}

export interface RecentTransaction {
  customer: string;
  action: string;
  date: string;
  amount: string;
}

export interface GenderDistribution {
  male: number;
  female: number;
}

export interface ChartDataPoint {
  day: string;
  customers: number;
}

export interface DashboardStats {
  totalCustomers: number;
  totalPoints: number;
  pointsSpent: number;
  rewardsRedeemed: number;
  redeemedThisMonth: number;
  redemptionRate: number;
  activationRate: number;
  inactiveCustomers: number;
  inactivePercentage: number;
  closeToReward: number;
  needsPointsOrLess: number;
  topCustomers: TopCustomer[];
  recentTransactions: RecentTransaction[];
  genderDistribution: GenderDistribution;
  chartData: ChartDataPoint[];
  newCustomers: number;
  activeCustomers: number;
  totalCount: number;
  upFromLastMonth: boolean;
}

export type PeriodId = "day" | "week" | "month" | "year" | "all";
