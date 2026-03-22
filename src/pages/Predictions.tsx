import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { useForecast } from "@/hooks/use-api";

export default function Predictions() {
  const { data, isLoading, error } = useForecast();

  return (
    <DashboardLayout>
      <div className="p-8 animate-fade-in">
        <PageHeader
          title="Predictions"
          description="AI-powered revenue forecasting and trend analysis"
        />

        {error && (
          <Card className="bg-destructive/5 border-destructive/20 mb-6">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">Failed to load forecast data.</p>
            </CardContent>
          </Card>
        )}

        {/* Forecast Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="bg-card border-border">
                  <CardHeader className="pb-2"><Skeleton className="h-4 w-32" /></CardHeader>
                  <CardContent><Skeleton className="h-8 w-24 mb-2" /><Skeleton className="h-4 w-36" /></CardContent>
                </Card>
              ))
            : data?.metrics.map((metric) => (
                <Card key={metric.period} className="bg-card border-border">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {metric.period} Forecast
                      </CardTitle>
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                        {metric.confidence}% confidence
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{metric.value}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <TrendingUp className="h-4 w-4 text-success" />
                      <span className="text-success text-sm">{metric.change}</span>
                      <span className="text-muted-foreground text-sm">projected growth</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>

        {/* Forecast Chart */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold">Revenue Forecast</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-primary" />
                  <span className="text-muted-foreground">Actual</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-primary/50" style={{ borderStyle: "dashed" }} />
                  <span className="text-muted-foreground">Forecast</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary/10 rounded" />
                  <span className="text-muted-foreground">Confidence Range</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : data?.chart_data ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.chart_data}>
                    <defs>
                      <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                    <XAxis dataKey="date" stroke="hsl(215, 14%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(215, 14%, 55%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(220, 16%, 10%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px" }}
                      labelStyle={{ color: "hsl(210, 20%, 95%)" }}
                      formatter={(value: number | null, name: string) => {
                        if (value === null) return ["-", name];
                        return [`$${value.toLocaleString()}`, name];
                      }}
                    />
                    <Area type="monotone" dataKey="upper" stroke="none" fill="url(#colorConfidence)" name="Upper Bound" />
                    <Area type="monotone" dataKey="lower" stroke="none" fill="hsl(220, 16%, 6%)" name="Lower Bound" />
                    <Line type="monotone" dataKey="actual" stroke="hsl(199, 89%, 48%)" strokeWidth={2} dot={{ fill: "hsl(199, 89%, 48%)", strokeWidth: 0, r: 4 }} name="Actual" />
                    <Line type="monotone" dataKey="forecast" stroke="hsl(199, 89%, 48%)" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: "hsl(199, 89%, 48%)", strokeWidth: 0, r: 4 }} name="Forecast" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-20">No forecast data available</p>
            )}
          </CardContent>
        </Card>

        {/* Seasonal Patterns */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg font-semibold">AI-Detected Seasonal Patterns</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : data?.seasonal_patterns && data.seasonal_patterns.length > 0 ? (
              <div className="space-y-4">
                {data.seasonal_patterns.map((pattern) => (
                  <div key={pattern.pattern} className="p-4 rounded-lg bg-muted/30 border border-border">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-foreground">{pattern.pattern}</h4>
                      <Badge
                        variant="secondary"
                        className={pattern.impact === "High" ? "bg-primary/10 text-primary border-0" : "bg-muted text-muted-foreground border-0"}
                      >
                        {pattern.impact} Impact
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{pattern.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">No patterns detected yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
