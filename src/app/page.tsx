"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AddMovementDialog } from "@/components/add-movement-dialog";
import { toast } from "sonner";
import MovementCards from "@/components/movement-cards";
import { Item, ItemMovement } from "@/db/schema";
import Loading from "@/components/loading-ui";
import MovementTable from "@/components/movement-table";

export default function ItemMovementPage() {
  const [movements, setMovements] = useState<ItemMovement[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [movementsRes, itemsRes] = await Promise.all([
        fetch("/api/movements?date=" + new Date().toISOString().split("T")[0]),
        fetch("/api/items"),
      ]);

      if (movementsRes.ok) {
        const movementsData = await movementsRes.json();
        setMovements(movementsData);
      }

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json();
        setItems(itemsData);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast.error("Gagal mengambil data!");
    } finally {
      setLoading(false);
    }
  };

  const handleMovementAdded = () => {
    fetchData();
    setShowAddDialog(false);
    toast.success("Transaksi Berhasil Ditambahkan");
  };

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <h1 className="text-lg font-semibold">Transaksi Barang</h1>
        </div>
        <div className="ml-auto">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Transaksi
          </Button>
        </div>
      </header>

      {loading ? (
        <Loading description="Memuat data transaksi..." />
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4">
          <MovementCards movements={movements} />
          <MovementTable movements={movements} items={items} />
        </div>
      )}

      <AddMovementDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        items={items}
        onSuccess={handleMovementAdded}
      />
    </SidebarInset>
  );
}
