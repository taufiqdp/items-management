"use client";

import Loading from "@/components/loading-ui";
import MovementHistory from "@/components/movement-history";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { jsonToExcel } from "@/lib/utils";
import { Calendar, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MovementsWithItem } from "../api/[...route]/route";
import { format } from "date-fns";

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [movements, setMovements] = useState<MovementsWithItem[]>([]);
  useEffect(() => {
    const fetchMovements = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/movements/all");
        if (!response.ok) {
          throw new Error("Failed to fetch movements");
        }
        const data = await response.json();
        setMovements(data);
      } catch (error) {
        console.error("Error fetching movements:", error);
        toast.error("Gagal mengambil data riwayat transaksi!");
      } finally {
        setLoading(false);
      }
    };
    fetchMovements();
  }, []);

  const handleExportToExcel = () => {
    if (movements.length === 0) {
      toast.error("Tidak ada data untuk diekspor");
      return;
    }

    try {
      const excelData = movements.map((movement, index) => ({
        No: index + 1,
        "Kode Barang": movement.itemKode,
        "Nama Barang": movement.itemNama || movement.itemKode,
        "Jenis Transaksi":
          movement.tipe === "masuk"
            ? "Barang Masuk"
            : movement.tipe === "keluar"
            ? "Barang Keluar"
            : "Barang Rusak",
        Jumlah: movement.jumlah,
        Tanggal: format(new Date(movement.tanggal), "dd/MM/yyyy"),
        Waktu: format(new Date(movement.tanggal), "HH:mm"),
        Keterangan: movement.keterangan || "-",
        "Harga Satuan": movement.harga
          ? `Rp ${movement.harga.toLocaleString("id-ID")}`
          : "-",
        "Total Nilai": movement.harga
          ? `Rp ${(movement.harga * movement.jumlah).toLocaleString("id-ID")}`
          : "-",
      }));

      const fileName = `riwayat-transaksi-${format(new Date(), "yyyy-MM-dd")}`;

      jsonToExcel(excelData, fileName);
      toast.success("Data berhasil diekspor ke Excel");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast.error("Gagal mengekspor data ke Excel");
    }
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <h1 className="text-lg font-semibold">Riwayat Transaksi Item</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleExportToExcel}
            disabled={loading || movements.length === 0}
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </header>
      {loading ? (
        <Loading description="Mengambil data riwayat..." />
      ) : (
        <MovementHistory movements={movements} />
      )}
    </SidebarInset>
  );
}
