import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jsonToExcel(
  jsonData: Record<string, unknown>[],
  fileName: string
) {
  const worksheet = XLSX.utils.json_to_sheet(jsonData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Generate buffer
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });

  // Create a Blob from the buffer
  const blob = new Blob([buffer], { type: "application/octet-stream" });

  // Create a link element
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.xlsx`;

  // Append to the body and trigger download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
}
