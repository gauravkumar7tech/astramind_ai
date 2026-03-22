import type { DragEvent, KeyboardEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, FileSpreadsheet, RefreshCw, Table, Upload } from "lucide-react";

interface UploadDropzoneProps {
  isDragOver: boolean;
  isUploading: boolean;
  onBrowse: () => void;
  onConnectDatabase: () => void;
  onConnectSheets: () => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}

export function UploadDropzone({
  isDragOver,
  isUploading,
  onBrowse,
  onConnectDatabase,
  onConnectSheets,
  onDragLeave,
  onDragOver,
  onDrop,
}: UploadDropzoneProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onBrowse();
    }
  };

  return (
    <Card
      className={`bg-card border-2 border-dashed mb-8 transition-all ${
        isDragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      } ${isUploading ? "cursor-progress" : "cursor-pointer"}`}
      onClick={isUploading ? undefined : onBrowse}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Upload your data"
    >
      <CardContent className="py-12">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {isUploading ? "Uploading your data" : "Upload your data"}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-md">
            {isUploading
              ? "Reading your file and mapping rows and columns now."
              : "Drag and drop CSV or Excel files here, or click to browse. We'll inspect the first sheet and add it to your dataset list."}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={(event) => {
                event.stopPropagation();
                onBrowse();
              }}
            >
              {isUploading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <FileSpreadsheet className="h-4 w-4 mr-2" />
              )}
              Upload CSV/Excel
            </Button>
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={(event) => {
                event.stopPropagation();
                onConnectDatabase();
              }}
            >
              <Database className="h-4 w-4 mr-2" />
              Connect Database
            </Button>
            <Button
              variant="outline"
              disabled={isUploading}
              onClick={(event) => {
                event.stopPropagation();
                onConnectSheets();
              }}
            >
              <Table className="h-4 w-4 mr-2" />
              Google Sheets
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
