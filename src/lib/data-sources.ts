import * as XLSX from "xlsx";

export interface Dataset {
  id: string;
  name: string;
  type: "csv" | "excel" | "database" | "sheets";
  status: "connected" | "syncing" | "error";
  rows: number;
  columns: number;
  lastSync: Date;
}

export const supportedDatasetFormats = ".csv,.xlsx,.xls";



const supportedExtensions = new Set(["csv", "xlsx", "xls"]);

function getFileExtension(fileName: string) {
  return fileName.split(".").pop()?.toLowerCase() ?? "";
}

function getDatasetType(fileName: string): Dataset["type"] {
  return getFileExtension(fileName) === "csv" ? "csv" : "excel";
}

function extractSheetStats(workbook: XLSX.WorkBook) {
  const firstSheetName = workbook.SheetNames[0];
  const firstSheet = firstSheetName ? workbook.Sheets[firstSheetName] : undefined;

  if (!firstSheet?.["!ref"]) {
    return { rows: 0, columns: 0 };
  }

  const range = XLSX.utils.decode_range(firstSheet["!ref"]);
  const totalRows = range.e.r - range.s.r + 1;
  const totalColumns = range.e.c - range.s.c + 1;

  return {
    rows: Math.max(totalRows - 1, 0),
    columns: totalRows > 0 ? totalColumns : 0,
  };
}

export async function createDatasetFromFile(file: File): Promise<Dataset> {
  const extension = getFileExtension(file.name);

  if (!supportedExtensions.has(extension)) {
    throw new Error("Please upload a CSV or Excel file.");
  }

  const workbook =
    extension === "csv"
      ? XLSX.read(
          typeof file.text === "function" ? await file.text() : await new Response(file).text(),
          { type: "string" },
        )
      : XLSX.read(
          typeof file.arrayBuffer === "function"
            ? await file.arrayBuffer()
            : await new Response(file).arrayBuffer(),
          { type: "array" },
        );
  const { rows, columns } = extractSheetStats(workbook);

  return {
    id: crypto.randomUUID(),
    name: file.name,
    type: getDatasetType(file.name),
    status: "connected",
    rows,
    columns,
    lastSync: new Date(),
  };
}
