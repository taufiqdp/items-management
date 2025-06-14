"use client";

import type React from "react";

import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Item } from "@/db/schema";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item;
  onSuccess: () => void;
}

export function EditItemDialog({
  open,
  onOpenChange,
  item,
  onSuccess,
}: EditItemDialogProps) {
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [kategori, setKategori] = useState("");
  const [stok, setStok] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setKode(item.kode);
      setNama(item.nama);
      setHargaBeli(item.hargaBeli.toString());
      setHargaJual(item.hargaJual.toString());
      setKategori(item.kategori);
      setStok(item.stok.toString());
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kode || !nama || !hargaBeli || !hargaJual || !kategori || !stok) {
      toast.error("Harap isi semua kolom yang wajib diisi");
      return;
    }

    const hargaBeliNum = Number.parseInt(hargaBeli);
    const hargaJualNum = Number.parseInt(hargaJual);
    const stokNum = Number.parseInt(stok);

    if (isNaN(hargaBeliNum) || hargaBeliNum < 0) {
      toast.error("Harga beli harus berupa angka yang valid");
      return;
    }

    if (isNaN(hargaJualNum) || hargaJualNum < 0) {
      toast.error("Harga jual harus berupa angka yang valid");
      return;
    }

    if (isNaN(stokNum) || stokNum < 0) {
      toast.error("Stok harus berupa angka yang valid");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/items/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kode: kode.trim(),
          nama: nama.trim(),
          hargaBeli: hargaBeliNum,
          hargaJual: hargaJualNum,
          kategori: kategori.trim(),
          stok: stokNum,
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to update item");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Barang</DialogTitle>
          <DialogDescription>Perbarui informasi barang.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode">Kode Barang *</Label>
              <Input
                id="kode"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="Masukkan kode barang yang unik"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nama">Nama Barang *</Label>
              <Input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama barang"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hargaBeli">Harga Beli (Rp) *</Label>
              <Input
                id="hargaBeli"
                type="number"
                min="0"
                value={hargaBeli}
                onChange={(e) => setHargaBeli(e.target.value)}
                placeholder="Masukkan harga beli"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="hargaJual">Harga Jual (Rp) *</Label>
              <Input
                id="hargaJual"
                type="number"
                min="0"
                value={hargaJual}
                onChange={(e) => setHargaJual(e.target.value)}
                placeholder="Masukkan harga jual"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="kategori">Kategori *</Label>
              <Input
                id="kategori"
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                placeholder="Masukkan kategori barang"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stok">Stok *</Label>
              <Input
                id="stok"
                type="number"
                min="0"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                placeholder="Masukkan jumlah stok"
              />
              <p className="text-sm text-muted-foreground">
                Catatan: Mengubah stok di sini tidak akan membuat catatan pergerakan stok
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Memperbarui..." : "Perbarui Barang"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
