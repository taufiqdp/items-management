"use client";

import type React from "react";

import { useState } from "react";

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
import { ItemInsert } from "@/db/schema";

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddItemDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddItemDialogProps) {
  const [kode, setKode] = useState("");
  const [nama, setNama] = useState("");
  const [hargaBeli, setHargaBeli] = useState("");
  const [hargaJual, setHargaJual] = useState("");
  const [kategori, setKategori] = useState("");
  const [stok, setStok] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kode || !nama || !hargaJual || !stok || !hargaBeli || !kategori) {
      toast.error("Harap isi kolom yang wajib diisi");
      return;
    }

    const stokNum = Number.parseInt(stok);

    if (isNaN(stokNum) || stokNum < 0) {
      toast.error("Stock must be a valid number");
      return;
    }

    try {
      setLoading(true);
      const requestBody: ItemInsert = {
        kode: kode.trim(),
        nama: nama.trim(),
        hargaBeli: Number.parseInt(hargaBeli),
        hargaJual: Number.parseInt(hargaJual),
        kategori: kategori.trim() || "default",
        stok: stokNum,
      };
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        onSuccess();
        // Reset form
        setKode("");
        setNama("");
        setHargaBeli("");
        setHargaJual("");
        setKategori("");
        setStok("");
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add item. Please try again.");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tambah Barang</DialogTitle>
          <DialogDescription>
            Tambah barang baru ke inventaris.
          </DialogDescription>
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
              <Label htmlFor="stok">Stok Awal *</Label>
              <Input
                id="stok"
                type="number"
                min="0"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                placeholder="Masukkan jumlah stok awal"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Menambahkan..." : "Tambah Barang"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
