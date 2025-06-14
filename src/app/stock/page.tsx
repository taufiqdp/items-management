"use client";

import { useState, useEffect } from "react";
import { Plus, Package, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AddItemDialog } from "@/components/add-item-dialog";
import { EditItemDialog } from "@/components/edit-item-dialog";
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

// Add this import instead
import { toast } from "sonner";
import { Item } from "@/db/schema";
import ItemTable from "@/components/item-table";
import Loading from "@/components/loading-ui";

export default function StockItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredItems(items);
    } else {
      const filtered = items.filter(
        (item) =>
          item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.kode.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  }, [items, searchQuery]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/items");
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        throw new Error("Failed to fetch items");
      }
    } catch (error) {
      console.error("Failed to fetch items:", error);
      toast.error("Gagal mengambil data barang");
    } finally {
      setLoading(false);
    }
  };

  const handleItemAdded = () => {
    fetchItems();
    setShowAddDialog(false);
    toast.success("Barang berhasil ditambahkan");
  };

  const handleItemUpdated = () => {
    fetchItems();
    setEditingItem(null);
    toast.success("Barang berhasil diperbarui");
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;

    try {
      const response = await fetch(`/api/items/${deletingItem.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchItems();
        toast.success("Barang berhasil dihapus");
      } else {
        throw new Error("Failed to delete item");
      }
    } catch (error) {
      console.error("Failed to delete item:", error);
      toast.error("Gagal menghapus barang");
    } finally {
      setDeletingItem(null);
    }
  };

  const totalItems = items.length;
  const totalValue = items.reduce(
    (sum, item) => sum + item.hargaJual * item.stok,
    0
  );
  const lowStockItems = items.filter((item) => item.stok < 10).length;
  const outOfStockItems = items.filter((item) => item.stok === 0).length;

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <h1 className="text-lg font-semibold">Barang Stok</h1>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari barang..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 w-64"
            />
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Barang
          </Button>
        </div>
      </header>

      {loading ? (
        <Loading description="Memuat data..." />
      ) : (
        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* Ringkasan Stok */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Barang
                </CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  Barang dalam inventaris
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Nilai
                </CardTitle>
                <Package className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  Rp {totalValue.toLocaleString("id-ID")}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total nilai inventaris
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stok Rendah
                </CardTitle>
                <Package className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {lowStockItems}
                </div>
                <p className="text-xs text-muted-foreground">
                  Barang di bawah 10 unit
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Stok Habis
                </CardTitle>
                <Package className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {outOfStockItems}
                </div>
                <p className="text-xs text-muted-foreground">
                  Barang dengan stok 0
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabel Barang */}
          <ItemTable
            searchQuery={searchQuery}
            setDeletingItem={setDeletingItem}
            setEditingItem={setEditingItem}
            filteredItems={filteredItems}
          />
        </div>
      )}

      <AddItemDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={handleItemAdded}
      />

      {editingItem && (
        <EditItemDialog
          open={!!editingItem}
          onOpenChange={(open) => !open && setEditingItem(null)}
          item={editingItem}
          onSuccess={handleItemUpdated}
        />
      )}

      <AlertDialog
        open={!!deletingItem}
        onOpenChange={(open) => !open && setDeletingItem(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Hal ini akan menghapus barang &quot;{deletingItem?.nama}&quot;
              secara permanen beserta semua riwayat pergerakannya. Tindakan ini
              tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteItem}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarInset>
  );
}
