import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Calendar, Download, TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useAnalytics } from "@/hooks/use-api";

export default function Analytics() {
  const [period, setPeriod] = useState("30d");
  const { data, isLoading, error } = useAnalytics(period);

  return (
    <DashboardLayout>
      <div className="p-8 animate-fade-in">
        <PageHeader
          title="Analytics"
          description="Deep dive into your business metrics"
          action={
            <div className="flex items-center gap-3">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-40 bg-background">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          }
        />

        {error && (
          <Card className="bg-destructive/5 border-destructive/20 mb-6">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">Failed to load analytics data.</p>
            </CardContent>
          </Card>
        )}

        {/* Revenue Chart */}
        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-80 w-full" />
            ) : data?.revenue_data ? (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.revenue_data}>
                    <defs>
                      <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPrevious" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(215, 14%, 55%)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="hsl(215, 14%, 55%)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 14%, 16%)" />
                    <XAxis dataKey="month" stroke="hsl(215, 14%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="hsl(215, 14%, 55%)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "hsl(220, 16%, 10%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px" }}
                      labelStyle={{ color: "hsl(210, 20%, 95%)" }}
                    />
                    <Area type="monotone" dataKey="previous" stroke="hsl(215, 14%, 55%)" strokeWidth={2} fillOpacity={1} fill="url(#colorPrevious)" name="Previous Year" />
                    <Area type="monotone" dataKey="current" stroke="hsl(199, 89%, 48%)" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" name="Current Year" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-20">No data available</p>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Products */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Top Products</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-14 w-full" />
                  ))}
                </div>
              ) : data?.top_products && data.top_products.length > 0 ? (
                <div className="space-y-4">
                  {data.top_products.map((product, index) => (
                    <div key={product.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-muted-foreground w-6">#{index + 1}</span>
                        <div>
                          <p className="font-medium text-foreground">{product.name}</p>
                          <p className="text-sm text-muted-foreground">${product.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {product.growth >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-success" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-destructive" />
                        )}
                        <span className={product.growth >= 0 ? "text-success text-sm" : "text-destructive text-sm"}>
                          {product.growth >= 0 ? "+" : ""}{product.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No product data available</p>
              )}
            </CardContent>
          </Card>

          {/* Revenue by Region */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Revenue by Region</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : data?.region_data && data.region_data.length > 0 ? (
                <>
                  <div className="h-64 flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={data.region_data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                          {data.region_data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: "hsl(220, 16%, 10%)", border: "1px solid hsl(220, 14%, 16%)", borderRadius: "8px" }}
                          formatter={(value: number) => [`${value}%`, "Share"]}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {data.region_data.map((region) => (
                      <div key={region.name} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: region.color }} />
                        <span className="text-sm text-muted-foreground">{region.name}: {region.value}%</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">No region data available</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
