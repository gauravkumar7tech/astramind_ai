import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Lightbulb,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  Check,
  X,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";
import { useRecommendations, useUpdateRecommendation } from "@/hooks/use-api";
import type { Recommendation } from "@/lib/api";

const categoryIcons: Record<string, React.ElementType> = {
  pricing: DollarSign,
  inventory: Package,
  expansion: TrendingUp,
  customer: Users,
};

const categoryLabels: Record<string, string> = {
  pricing: "Pricing",
  inventory: "Inventory",
  expansion: "Expansion",
  customer: "Customer",
};

export default function Recommendations() {
  const { data, isLoading, error } = useRecommendations();
  const updateRec = useUpdateRecommendation();
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "dismissed">("all");

  const recommendations = data?.recommendations || [];
  const filtered = recommendations.filter((rec) => filter === "all" ? true : rec.status === filter);

  const pendingImpact = recommendations
    .filter((r) => r.status === "pending")
    .reduce((sum, r) => sum + r.impact_value, 0);
  const acceptedImpact = recommendations
    .filter((r) => r.status === "accepted")
    .reduce((sum, r) => sum + r.impact_value, 0);

  const handleAction = (id: string, action: "accepted" | "dismissed") => {
    updateRec.mutate({ id, action });
  };

  return (
    <DashboardLayout>
      <div className="p-8 animate-fade-in">
        <PageHeader title="Recommendations" description="AI-generated actions to improve your business" />

        {error && (
          <Card className="bg-destructive/5 border-destructive/20 mb-6">
            <CardContent className="flex items-center gap-3 py-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <p className="text-sm text-destructive">Failed to load recommendations.</p>
            </CardContent>
          </Card>
        )}

        {/* Impact Summary */}
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
                      <p className="text-sm text-muted-foreground">Pending Actions</p>
                      <p className="text-2xl font-bold text-foreground">
                        {recommendations.filter((r) => r.status === "pending").length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Lightbulb className="h-6 w-6 text-warning" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">${pendingImpact.toLocaleString()} potential impact</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Accepted</p>
                      <p className="text-2xl font-bold text-foreground">
                        {recommendations.filter((r) => r.status === "accepted").length}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <Check className="h-6 w-6 text-success" />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">${acceptedImpact.toLocaleString()} committed impact</p>
                </CardContent>
              </Card>
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Recommendations</p>
                      <p className="text-2xl font-bold text-foreground">{recommendations.length}</p>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {(["all", "pending", "accepted", "dismissed"] as const).map((status) => (
            <Button key={status} variant={filter === status ? "default" : "outline"} size="sm" onClick={() => setFilter(status)} className="capitalize">
              {status}
            </Button>
          ))}
        </div>

        {/* Recommendations List */}
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-card border-border">
                <CardContent className="p-6"><Skeleton className="h-24 w-full" /></CardContent>
              </Card>
            ))
          ) : filtered.length > 0 ? (
            filtered.map((rec) => {
              const Icon = categoryIcons[rec.category] || Lightbulb;
              return (
                <Card key={rec.id} className={`bg-card border-border transition-all ${rec.status !== "pending" ? "opacity-60" : ""}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        rec.priority === "high" ? "bg-destructive/10" : rec.priority === "medium" ? "bg-warning/10" : "bg-muted"
                      }`}>
                        <Icon className={`h-5 w-5 ${
                          rec.priority === "high" ? "text-destructive" : rec.priority === "medium" ? "text-warning" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{rec.title}</h3>
                          <Badge variant="secondary" className={`text-xs ${
                            rec.priority === "high" ? "bg-destructive/10 text-destructive" : rec.priority === "medium" ? "bg-warning/10 text-warning" : "bg-muted text-muted-foreground"
                          }`}>{rec.priority}</Badge>
                          <Badge variant="outline" className="text-xs">{categoryLabels[rec.category] || rec.category}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-success" />
                          <span className="text-sm font-medium text-success">{rec.impact}</span>
                        </div>
                      </div>
                      {rec.status === "pending" ? (
                        <div className="flex items-center gap-2 shrink-0">
                          <Button size="sm" variant="outline" onClick={() => handleAction(rec.id, "dismissed")} className="gap-1">
                            <X className="h-4 w-4" />Dismiss
                          </Button>
                          <Button size="sm" onClick={() => handleAction(rec.id, "accepted")} className="gap-1">
                            <Check className="h-4 w-4" />Accept
                          </Button>
                        </div>
                      ) : (
                        <Badge variant="secondary" className={rec.status === "accepted" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"}>
                          {rec.status}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="py-12 text-center">
                <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-medium text-foreground mb-1">No recommendations found</h3>
                <p className="text-sm text-muted-foreground">
                  {filter === "all" ? "Connect your data to get AI-powered recommendations" : `No ${filter} recommendations`}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
