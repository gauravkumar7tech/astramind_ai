import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { UploadDropzone } from "@/components/data-manager/UploadDropzone";
import { DatasetList } from "@/components/data-manager/DatasetList";
import {
  createDatasetFromFile,
  supportedDatasetFormats,
  type Dataset,
} from "@/lib/data-sources";
import { Plus } from "lucide-react";

export default function DataManager() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFiles = async (fileList: FileList | null) => {
    const file = fileList?.[0];

    if (!file) {
      return;
    }

    setIsUploading(true);

    try {
      const dataset = await createDatasetFromFile(file);
      setDatasets((currentDatasets) => [dataset, ...currentDatasets]);
      toast.success("Upload complete", {
        description: `${dataset.name} is ready with ${dataset.rows.toLocaleString()} rows and ${dataset.columns} columns.`,
      });
    } catch (error) {
      toast.error("Upload failed", {
        description: error instanceof Error ? error.message : "We could not read that file.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    await handleFiles(event.target.files);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

    setIsDragOver(false);
  };

  const handleDrop = async (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    await handleFiles(event.dataTransfer.files);
  };

  const handlePreviewDataset = (dataset: Dataset) => {
    toast(dataset.name, {
      description: `${dataset.rows.toLocaleString()} rows • ${dataset.columns} columns • ${dataset.status}`,
    });
  };

  const handleSyncDataset = (dataset: Dataset) => {
    setDatasets((currentDatasets) =>
      currentDatasets.map((currentDataset) =>
        currentDataset.id === dataset.id
          ? { ...currentDataset, status: "connected", lastSync: new Date() }
          : currentDataset,
      ),
    );

    toast.success("Dataset synced", {
      description: `${dataset.name} was refreshed just now.`,
    });
  };

  const handleRemoveDataset = (dataset: Dataset) => {
    setDatasets((currentDatasets) =>
      currentDatasets.filter((currentDataset) => currentDataset.id !== dataset.id),
    );

    toast.success("Dataset removed", {
      description: `${dataset.name} has been removed from the list.`,
    });
  };

  const showComingSoonMessage = (label: string) => {
    toast(label, {
      description: "This connection flow is not wired yet.",
    });
  };

  return (
    <DashboardLayout>
      <div className="p-8 animate-fade-in">
        <input
          ref={fileInputRef}
          type="file"
          accept={supportedDatasetFormats}
          className="hidden"
          onChange={(event) => {
            void handleInputChange(event);
          }}
        />

        <PageHeader
          title="Data Manager"
          description="Connect and manage your data sources"
          action={
            <Button className="gap-2" onClick={openFilePicker} disabled={isUploading}>
              <Plus className="h-4 w-4" />
              Add Data Source
            </Button>
          }
        />

        <UploadDropzone
          isDragOver={isDragOver}
          isUploading={isUploading}
          onBrowse={openFilePicker}
          onConnectDatabase={() => showComingSoonMessage("Connect Database")}
          onConnectSheets={() => showComingSoonMessage("Google Sheets")}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={(event) => {
            void handleDrop(event);
          }}
        />

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">Connected Datasets</h2>
          <DatasetList
            datasets={datasets}
            onPreview={handlePreviewDataset}
            onSync={handleSyncDataset}
            onRemove={handleRemoveDataset}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
