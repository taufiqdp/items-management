"use client";

import { useState, useEffect } from "react";
import { Plus, Calendar } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AddMovementDialog } from "@/components/add-movement-dialog";
import { EditMovementDialog } from "@/components/edit-movement-dialog";
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
  const [editingMovement, setEditingMovement] = useState<ItemMovement | null>(
    null
  );
  const [deletingMovement, setDeletingMovement] = useState<ItemMovement | null>(
    null
  );

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

  const handleMovementUpdated = () => {
    fetchData();
    setEditingMovement(null);
    toast.success("Transaksi berhasil diperbarui");
  };

  const handleDeleteMovement = async () => {
    if (!deletingMovement) return;

    try {
      const response = await fetch(
        `/api/items/${items[0].id}/movement/${deletingMovement.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        fetchData();
        toast.success("Transaksi berhasil dihapus");
      } else {
        throw new Error("Failed to delete movement");
      }
    } catch (error) {
      console.error("Failed to delete movement:", error);
      toast.error("Gagal menghapus transaksi");
    } finally {
      setDeletingMovement(null);
    }
  };

  const getItemName = (kode: string) => {
    const item = items.find((item) => item.kode === kode);
    return item ? item.nama : kode;
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
          <MovementTable
            movements={movements}
            items={items}
            setEditingMovement={setEditingMovement}
            setDeletingMovement={setDeletingMovement}
          />
        </div>
      )}

      <AddMovementDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        items={items}
        onSuccess={handleMovementAdded}
      />

      {editingMovement && (
        <EditMovementDialog
          open={!!editingMovement}
          onOpenChange={(open) => !open && setEditingMovement(null)}
          movement={editingMovement}
          items={items}
          onSuccess={handleMovementUpdated}
        />
      )}

      <AlertDialog
        open={!!deletingMovement}
        onOpenChange={(open) => !open && setDeletingMovement(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Hal ini akan menghapus transaksi &quot;{deletingMovement?.tipe}
              &quot; untuk barang &quot;
              {deletingMovement && getItemName(deletingMovement.itemKode)}&quot;
              secara permanen. Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMovement}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  );
}
