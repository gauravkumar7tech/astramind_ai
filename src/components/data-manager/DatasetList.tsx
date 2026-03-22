import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Dataset } from "@/lib/data-sources";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Database,
  Eye,
  FileSpreadsheet,
  MoreVertical,
  RefreshCw,
  Table,
  Trash2,
} from "lucide-react";

const typeConfig: Record<Dataset["type"], { color: string; icon: typeof FileSpreadsheet; label: string }> = {
  csv: { icon: FileSpreadsheet, label: "CSV File", color: "text-success" },
  excel: { icon: FileSpreadsheet, label: "Excel Workbook", color: "text-primary" },
  database: { icon: Database, label: "PostgreSQL", color: "text-primary" },
  sheets: { icon: Table, label: "Google Sheets", color: "text-warning" },
};

const statusConfig: Record<Dataset["status"], { color: string; icon: typeof CheckCircle; label: string }> = {
  connected: { icon: CheckCircle, label: "Connected", color: "text-success" },
  syncing: { icon: RefreshCw, label: "Syncing", color: "text-warning" },
  error: { icon: AlertCircle, label: "Error", color: "text-destructive" },
};

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

interface DatasetListProps {
  datasets: Dataset[];
  onPreview: (dataset: Dataset) => void;
  onRemove: (dataset: Dataset) => void;
  onSync: (dataset: Dataset) => void;
}

export function DatasetList({ datasets, onPreview, onRemove, onSync }: DatasetListProps) {
  if (!datasets.length) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="py-12 text-center">
          <Database className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-medium text-foreground mb-1">No data connected</h3>
          <p className="text-sm text-muted-foreground">
            Upload a file or connect a database to get started with analysis.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {datasets.map((dataset) => {
        const typeInfo = typeConfig[dataset.type];
        const statusInfo = statusConfig[dataset.status];
        const TypeIcon = typeInfo.icon;
        const StatusIcon = statusInfo.icon;

        return (
          <Card key={dataset.id} className="bg-card border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <TypeIcon className={`h-5 w-5 ${typeInfo.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground truncate">{dataset.name}</h3>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {typeInfo.label}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span>{dataset.rows.toLocaleString()} rows</span>
                    <span>{dataset.columns} columns</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Synced {formatTimeAgo(dataset.lastSync)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1">
                    <StatusIcon
                      className={`h-4 w-4 ${statusInfo.color} ${
                        dataset.status === "syncing" ? "animate-spin" : ""
                      }`}
                    />
                    <span className={`text-sm ${statusInfo.color}`}>{statusInfo.label}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Manage ${dataset.name}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onSelect={() => onPreview(dataset)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Data
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => onSync(dataset)}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Sync Now
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onSelect={() => onRemove(dataset)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
