import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertTriangle,
  AlertCircle,
  Info,
  TrendingDown,
  Clock,
  CheckCircle,
  Bell,
  BellOff,
} from "lucide-react";
import { useAlerts, useAcknowledgeAlert } from "@/hooks/use-api";

const severityConfig = {
  critical: {
    icon: AlertCircle,
    color: "text-destructive",
    bg: "bg-destructive/10",
    badge: "bg-destructive/10 text-destructive border-0",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    badge: "bg-warning/10 text-warning border-0",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bg: "bg-primary/10",
    badge: "bg-primary/10 text-primary border-0",
  },
};

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function Alerts() {
  const { data, isLoading, error } = useAlerts();
  const acknowledgeAlert = useAcknowledgeAlert();
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">("all");

  const alerts = data?.alerts || [];
  const filtered = alerts.filter((a) => filter === "all" ? true : a.severity === filter);
  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;
  const criticalCount = alerts.filter((a) => a.severity === "critical" && !a.acknowledged).length;

  return (
    <DashboardLayout>
      <div className="p-8 animate-fade-in">
        <PageHeader
          title="Alerts"
          description="Anomaly detection and risk monitoring"
          action={
            <div className="flex items-center gap-2">
              {unacknowledgedCount > 0 && (
                <Badge variant="secondary" className="bg-destructive/10 text-destructive">
                  {unacknowledgedCount} unread
                </Badge>
              )}
            </div>
          }
        />

        {error && (
          <Card className="bg-destructive/5 border-destructive/20 mb-6">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">Failed to load alerts.</p>
            </CardContent>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Critical Alerts</p>
                      <p className="text-2xl font-bold text-destructive">{criticalCount}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center">
                      <AlertCircle className="h-6 w-6 text-destructive" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Warnings</p>
                      <p className="text-2xl font-bold text-warning">
                        {alerts.filter((a) => a.severity === "warning" && !a.acknowledged).length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                      <AlertTriangle className="h-6 w-6 text-warning" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Informational</p>
                      <p className="text-2xl font-bold text-primary">
                        {alerts.filter((a) => a.severity === "info").length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Info className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "critical", "warning", "info"] as const).map((severity) => (
            <Button key={severity} variant={filter === severity ? "default" : "outline"} size="sm" onClick={() => setFilter(severity)} className="capitalize">
              {severity}
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6"><Skeleton className="h-28 w-full" /></CardContent>
              </Card>
            ))
          ) : filtered.length > 0 ? (
            filtered.map((alert) => {
              const config = severityConfig[alert.severity];
              const Icon = config.icon;
              return (
                <Card key={alert.id} className={`bg-card border-border transition-all ${alert.acknowledged ? "opacity-60" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center shrink-0`}>
                        <Icon className={`h-5 w-5 ${config.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{alert.title}</h3>
                          <Badge variant="secondary" className={config.badge}>{alert.severity}</Badge>
                          {alert.acknowledged && (
                            <Badge variant="outline" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />Acknowledged
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                        {alert.root_cause && (
                          <div className="p-3 rounded-lg bg-muted/30 border border-border mb-3">
                            <p className="text-xs text-muted-foreground mb-1">AI Root Cause Analysis</p>
                            <p className="text-sm text-foreground">{alert.root_cause}</p>
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-sm">
                          {alert.metric && (
                            <div className="flex items-center gap-1">
                              <TrendingDown className={`h-4 w-4 ${config.color}`} />
                              <span className={config.color}>{alert.metric}</span>
                              <span className="text-muted-foreground">({alert.change})</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {formatTimeAgo(alert.timestamp)}
                          </div>
                        </div>
                      </div>
                      {!alert.acknowledged && (
                        <Button size="sm" variant="outline" onClick={() => acknowledgeAlert.mutate(alert.id)} className="shrink-0">
                          <BellOff className="h-4 w-4 mr-1" />Acknowledge
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-1">No alerts</h3>
                <p className="text-sm text-muted-foreground">
                  {filter === "all" ? "All systems running normally" : `No ${filter} alerts`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
