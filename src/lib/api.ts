function delay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Types
export interface KPI {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

export interface Insight {
  id: string | number;
  title: string;
  description: string;
  type: "positive" | "warning" | "info";
}

export interface MetricsResponse {
  kpis: KPI[];
  insights: Insight[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sql?: string;
  data?: Record<string, unknown>[];
}

export interface ChatResponse {
  answer: string;
  sql?: string;
  data?: Record<string, unknown>[];
}

export interface ForecastMetric {
  period: string;
  value: string;
  change: string;
  confidence: number;
  trend: "up" | "down";
}

export interface ForecastDataPoint {
  date: string;
  actual: number | null;
  forecast: number | null;
  lower: number | null;
  upper: number | null;
}

export interface SeasonalPattern {
  pattern: string;
  description: string;
  impact: string;
}

export interface ForecastResponse {
  metrics: ForecastMetric[];
  chart_data: ForecastDataPoint[];
  seasonal_patterns: SeasonalPattern[];
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  impact_value: number;
  category: "pricing" | "inventory" | "expansion" | "customer";
  priority: "high" | "medium" | "low";
  status: "pending" | "accepted" | "dismissed";
}

export interface RecommendationsResponse {
  recommendations: Recommendation[];
}

export interface Alert {
  id: string;
  title: string;
  description: string;
  root_cause?: string;
  severity: "critical" | "warning" | "info";
  timestamp: string;
  acknowledged: boolean;
  metric?: string;
  change?: string;
}

export interface AlertsResponse {
  alerts: Alert[];
}

export interface AnalyticsResponse {
  revenue_data: { month: string; current: number; previous: number }[];
  top_products: { name: string; revenue: number; growth: number }[];
  region_data: { name: string; value: number; color: string }[];
}

// Mock data
const mockMetrics: MetricsResponse = {
  kpis: [
    { title: "Total Revenue", value: "$2,847,392", change: "+12.5%", trend: "up" },
    { title: "Active Customers", value: "14,823", change: "+8.2%", trend: "up" },
    { title: "Orders", value: "9,241", change: "-3.1%", trend: "down" },
    { title: "Profit Margin", value: "34.7%", change: "+2.4%", trend: "up" },
  ],
  insights: [
    { id: 1, title: "Revenue up 12.5% MoM", description: "Strong performance driven by enterprise segment growth and new product launches.", type: "positive" },
    { id: 2, title: "Order volume declining", description: "Order count dropped 3.1% — consider a promotional campaign to re-engage mid-tier customers.", type: "warning" },
    { id: 3, title: "Profit margin improving", description: "Cost optimizations in Q3 are showing results with margin expanding 2.4 percentage points.", type: "info" },
  ],
};

const mockAnalytics: AnalyticsResponse = {
  revenue_data: [
    { month: "Jan", current: 210000, previous: 185000 },
    { month: "Feb", current: 198000, previous: 172000 },
    { month: "Mar", current: 235000, previous: 201000 },
    { month: "Apr", current: 248000, previous: 215000 },
    { month: "May", current: 262000, previous: 228000 },
    { month: "Jun", current: 279000, previous: 241000 },
    { month: "Jul", current: 291000, previous: 255000 },
    { month: "Aug", current: 305000, previous: 268000 },
    { month: "Sep", current: 318000, previous: 280000 },
    { month: "Oct", current: 334000, previous: 295000 },
    { month: "Nov", current: 347000, previous: 310000 },
    { month: "Dec", current: 320000, previous: 298000 },
  ],
  top_products: [
    { name: "Enterprise Suite", revenue: 842000, growth: 18.4 },
    { name: "Pro Plan", revenue: 631000, growth: 11.2 },
    { name: "Starter Pack", revenue: 412000, growth: -2.8 },
    { name: "Add-on Analytics", revenue: 298000, growth: 34.1 },
    { name: "Support Premium", revenue: 187000, growth: 6.5 },
  ],
  region_data: [
    { name: "North America", value: 42, color: "hsl(199, 89%, 48%)" },
    { name: "Europe", value: 28, color: "hsl(262, 83%, 58%)" },
    { name: "Asia Pacific", value: 18, color: "hsl(142, 71%, 45%)" },
    { name: "Latin America", value: 8, color: "hsl(38, 92%, 50%)" },
    { name: "Other", value: 4, color: "hsl(215, 14%, 55%)" },
  ],
};

const mockForecast: ForecastResponse = {
  metrics: [
    { period: "30-Day", value: "$1.1M", change: "+9.2%", confidence: 92, trend: "up" },
    { period: "60-Day", value: "$2.3M", change: "+11.8%", confidence: 85, trend: "up" },
    { period: "90-Day", value: "$3.6M", change: "+14.3%", confidence: 78, trend: "up" },
  ],
  chart_data: [
    { date: "Oct", actual: 334000, forecast: null, lower: null, upper: null },
    { date: "Nov", actual: 347000, forecast: null, lower: null, upper: null },
    { date: "Dec", actual: 320000, forecast: null, lower: null, upper: null },
    { date: "Jan", actual: null, forecast: 358000, lower: 330000, upper: 386000 },
    { date: "Feb", actual: null, forecast: 374000, lower: 340000, upper: 408000 },
    { date: "Mar", actual: null, forecast: 391000, lower: 350000, upper: 432000 },
  ],
  seasonal_patterns: [
    { pattern: "Q4 Holiday Surge", description: "Revenue consistently spikes 22% in November driven by enterprise budget cycles and holiday promotions.", impact: "High" },
    { pattern: "Summer Slowdown", description: "July–August shows 8% lower conversion rates as decision-makers take vacations.", impact: "Medium" },
    { pattern: "Q1 Renewal Wave", description: "January sees a 15% uptick in renewals and upsells as customers review annual budgets.", impact: "High" },
  ],
};

const mockRecommendations: Recommendation[] = [
  { id: "1", title: "Increase pricing for Enterprise tier", description: "Analysis shows enterprise customers have low price sensitivity. A 10% price increase could add $84K/month with minimal churn risk.", impact: "+$84K/month", impact_value: 84000, category: "pricing", priority: "high", status: "pending" },
  { id: "2", title: "Restock SKU-4821 inventory", description: "Top-selling product is projected to stock out in 12 days based on current velocity. Reorder now to avoid lost sales.", impact: "+$32K revenue protected", impact_value: 32000, category: "inventory", priority: "high", status: "pending" },
  { id: "3", title: "Launch APAC expansion campaign", description: "Asia Pacific shows 34% YoY growth with low CAC. Increasing marketing spend by $20K could yield $180K in new ARR.", impact: "+$180K ARR", impact_value: 180000, category: "expansion", priority: "medium", status: "pending" },
  { id: "4", title: "Re-engage churned customers", description: "142 customers churned in the last 90 days. A targeted win-back email sequence has historically recovered 18% of churned accounts.", impact: "+$41K ARR", impact_value: 41000, category: "customer", priority: "medium", status: "accepted" },
  { id: "5", title: "Bundle Starter + Analytics add-on", description: "Customers who use both products have 2.4x higher LTV. A bundled discount could accelerate adoption.", impact: "+$22K/month", impact_value: 22000, category: "pricing", priority: "low", status: "dismissed" },
];

const mockAlerts: Alert[] = [
  { id: "1", title: "Revenue drop in West region", description: "West region revenue fell 18% week-over-week, significantly below the -5% threshold.", root_cause: "Three enterprise accounts paused spending pending contract renewals. Expected to resolve within 2 weeks.", severity: "critical", timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), acknowledged: false, metric: "West Revenue", change: "-18% WoW" },
  { id: "2", title: "Cart abandonment rate elevated", description: "Cart abandonment reached 74%, up from the 65% baseline over the past 3 days.", root_cause: "Checkout page load time increased to 4.2s after last deployment. Engineering team notified.", severity: "warning", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), acknowledged: false, metric: "Abandonment Rate", change: "+9pts" },
  { id: "3", title: "New market opportunity detected", description: "Organic traffic from Southeast Asia increased 210% this month with strong conversion signals.", severity: "info", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), acknowledged: false },
  { id: "4", title: "Inventory threshold breached", description: "SKU-4821 stock level dropped below the 15-day safety threshold.", severity: "warning", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), acknowledged: true, metric: "Stock Level", change: "12 days remaining" },
];

const mockChatResponses: Record<string, ChatResponse> = {
  default: { answer: "Based on your business data, I can see strong overall performance with revenue up 12.5% month-over-month. Your enterprise segment is the primary growth driver. Would you like me to drill deeper into any specific area?", sql: "SELECT segment, SUM(revenue) as total_revenue FROM orders GROUP BY segment ORDER BY total_revenue DESC" },
};

// API functions (mock)
export const api = {
  getMetrics: async (): Promise<MetricsResponse> => { await delay(); return mockMetrics; },

  sendChatMessage: async (message: string): Promise<ChatResponse> => {
    await delay(1200);
    const lower = message.toLowerCase();
    if (lower.includes("product") || lower.includes("revenue")) {
      return { answer: "Your top product by revenue is Enterprise Suite at $842K, growing 18.4% YoY. The Analytics add-on is your fastest-growing product at +34.1%.", sql: "SELECT name, revenue, growth FROM products ORDER BY revenue DESC LIMIT 5" };
    }
    if (lower.includes("customer") || lower.includes("retention")) {
      return { answer: "You have 14,823 active customers with an 87% retention rate. Churn is concentrated in the Starter tier — 142 customers churned in the last 90 days.", sql: "SELECT COUNT(*) as active, AVG(retention_rate) FROM customers WHERE status = 'active'" };
    }
    if (lower.includes("region") || lower.includes("market")) {
      return { answer: "North America leads at 42% of revenue, followed by Europe at 28%. Asia Pacific is your fastest-growing region at +34% YoY.", sql: "SELECT region, SUM(revenue) as total, (SUM(revenue)/SUM(SUM(revenue)) OVER()) * 100 as pct FROM orders GROUP BY region" };
    }
    return mockChatResponses.default;
  },

  getForecast: async (): Promise<ForecastResponse> => { await delay(); return mockForecast; },

  getRecommendations: async (): Promise<RecommendationsResponse> => { await delay(); return { recommendations: mockRecommendations }; },

  getAlerts: async (): Promise<AlertsResponse> => { await delay(); return { alerts: mockAlerts }; },

  getAnalytics: async (_period?: string): Promise<AnalyticsResponse> => { await delay(); return mockAnalytics; },

  acknowledgeAlert: async (id: string): Promise<void> => {
    await delay(300);
    const alert = mockAlerts.find((a) => a.id === id);
    if (alert) alert.acknowledged = true;
  },

  updateRecommendation: async (id: string, action: "accepted" | "dismissed"): Promise<void> => {
    await delay(300);
    const rec = mockRecommendations.find((r) => r.id === id);
    if (rec) rec.status = action;
  },
};
