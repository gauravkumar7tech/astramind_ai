import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Percent,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useMetrics } from "@/hooks/use-api";

const iconMap: Record<string, React.ElementType> = {
  "Total Revenue": DollarSign,
  "Active Customers": Users,
  "Orders": ShoppingCart,
  "Profit Margin": Percent,
};

export default function Overview() {
  const { data, isLoading, error } = useMetrics();

  return (
    <DashboardLayout>
      <div className="p-8 animate-fade-in">
        <PageHeader
          title="Overview"
          description="Your business at a glance"
          action={
            <Link to="/chat">
              <Button className="gap-2">
                <Sparkles className="h-4 w-4" />
                Ask AI Analyst
              </Button>
            </Link>
          }
        />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-4 rounded" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-28 mb-2" />
                    <Skeleton className="h-4 w-36" />
                  </CardContent>
                </Card>
              ))
            : data?.kpis.map((kpi) => {
                const Icon = iconMap[kpi.title] || DollarSign;
                return (
                  <Card key={kpi.title} className="bg-card border-border hover:border-primary/30 transition-colors">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {kpi.title}
                      </CardTitle>
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-foreground">{kpi.value}</div>
                      <div className="flex items-center gap-1 mt-1">
                        {kpi.trend === "up" ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={kpi.trend === "up" ? "text-success text-sm" : "text-destructive text-sm"}>
                          {kpi.change}
                        </span>
                        <span className="text-muted-foreground text-sm">vs last month</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
        </div>

        {error && (
          <Card className="bg-destructive/5 border-destructive/20 mb-8">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">Failed to load metrics. Is your API server running at the configured URL?</p>
            </CardContent>
          </Card>
        )}

        {/* Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">AI Insights</CardTitle>
              <Link to="/recommendations">
                <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground hover:text-foreground">
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <Skeleton className="h-4 w-40 mb-2" />
                    <Skeleton className="h-3 w-full" />
                  </div>
                ))
              ) : data?.insights && data.insights.length > 0 ? (
                data.insights.map((insight) => (
                  <div
                    key={insight.id}
                    className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                          insight.type === "positive"
                            ? "bg-success"
                            : insight.type === "warning"
                            ? "bg-warning"
                            : "bg-primary"
                        }`}
                      />
                      <div>
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No insights available. Connect your data to get started.
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/data" className="block">
                <div className="p-4 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Connect Your Data
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Upload CSV files or connect to your database
                  </p>
                </div>
              </Link>
              <Link to="/chat" className="block">
                <div className="p-4 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Ask Your First Question
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Start a conversation with your AI analyst
                  </p>
                </div>
              </Link>
              <Link to="/predictions" className="block">
                <div className="p-4 rounded-lg border border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all cursor-pointer group">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    View Revenue Forecast
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    See AI-powered predictions for the next 90 days
                  </p>
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
