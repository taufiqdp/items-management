"use client";

import Loading from "@/components/loading-ui";
import MovementHistory from "@/components/movement-history";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, Download } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { MovementsWithItem } from "../api/[...route]/route";

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
          <Button variant="outline" className="flex items-center gap-2">
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
