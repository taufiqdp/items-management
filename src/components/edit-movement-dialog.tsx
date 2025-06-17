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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Item, ItemMovement } from "@/db/schema";

interface EditMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement: ItemMovement;
  items: Item[];
  onSuccess: () => void;
}

export function EditMovementDialog({
  open,
  onOpenChange,
  movement,
  items,
  onSuccess,
}: EditMovementDialogProps) {
  const [itemKode, setItemKode] = useState<string>("");
  const [tipe, setTipe] = useState<"masuk" | "keluar" | "rusak">("masuk");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [tanggal, setTanggal] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movement) {
      setItemKode(movement.itemKode);
      setTipe(movement.tipe as "masuk" | "keluar" | "rusak");
      setJumlah(movement.jumlah.toString());
      setKeterangan(movement.keterangan || "");
      const date = new Date(movement.tanggal);
      const formattedDate = date.toISOString().slice(0, 16);
      setTanggal(formattedDate);
    }
  }, [movement]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemKode || !tipe || !jumlah || !tanggal) {
      toast.error("Harap isi semua kolom yang wajib diisi");
      return;
    }

    const jumlahNum = Number.parseInt(jumlah);

    if (isNaN(jumlahNum) || jumlahNum <= 0) {
      toast.error("Jumlah harus berupa angka positif");
      return;
    }

    // Check if selected item exists
    const selectedItem = items.find((item) => item.kode === itemKode);
    if (!selectedItem) {
      toast.error("Barang yang dipilih tidak valid");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `/api/items/${items[0].id}/movement/${movement.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            itemKode: itemKode.trim(),
            tipe,
            jumlah: jumlahNum,
            keterangan: keterangan.trim() || null,
          }),
        }
      );

      if (response.ok) {
        onSuccess();
      } else {
        const error = await response.json();
        console.error("Failed to update movement:", error);
        throw new Error(error.message || "Failed to update movement");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update movement"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
          <DialogDescription>
            Perbarui informasi transaksi barang.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="itemKode">Barang *</Label>
              <Select value={itemKode} onValueChange={setItemKode}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih barang" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.kode} value={item.kode}>
                      {item.kode} - {item.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jenis">Jenis Transaksi *</Label>
              <Select
                value={tipe}
                onValueChange={(value: "masuk" | "keluar" | "rusak") =>
                  setTipe(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masuk">Barang Masuk</SelectItem>
                  <SelectItem value="keluar">Barang Keluar</SelectItem>
                  <SelectItem value="rusak">Barang Rusak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jumlah">Jumlah *</Label>
              <Input
                id="jumlah"
                type="number"
                min="1"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Masukkan jumlah"
              />
            </div>

            {/* <div className="grid gap-2">
              <Label htmlFor="tanggal">Tanggal & Waktu *</Label>
              <Input
                id="tanggal"
                type="datetime-local"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
              />
            </div> */}

            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Input
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Masukkan keterangan (opsional)"
              />
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
              {loading ? "Memperbarui..." : "Perbarui Transaksi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
