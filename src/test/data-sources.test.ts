import { createDatasetFromFile } from "@/lib/data-sources";
import { describe, expect, it } from "vitest";

describe("createDatasetFromFile", () => {
  it("extracts dataset metadata from csv uploads", async () => {
    const csvContent = "name,amount\nA,10\nB,20";
    const file = new File([csvContent], "sales.csv", { type: "text/csv" });

    Object.defineProperty(file, "text", {
      configurable: true,
      value: async () => csvContent,
    });

    const dataset = await createDatasetFromFile(file);

    expect(dataset.name).toBe("sales.csv");
    expect(dataset.type).toBe("csv");
    expect(dataset.rows).toBe(2);
    expect(dataset.columns).toBe(2);
    expect(dataset.status).toBe("connected");
  });

  it("rejects unsupported file types", async () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });

    await expect(createDatasetFromFile(file)).rejects.toThrow("Please upload a CSV or Excel file.");
  });
});
