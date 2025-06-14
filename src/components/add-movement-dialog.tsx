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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Item } from "@/db/schema";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import { cn } from "@/lib/utils";

interface AddMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Item[];
  onSuccess: () => void;
}

export function AddMovementDialog({
  open,
  onOpenChange,
  items,
  onSuccess,
}: AddMovementDialogProps) {
  const [selectedItemId, setSelectedItemId] = useState("");
  const [tipe, setTipe] = useState<"masuk" | "keluar">("masuk");
  const [jumlah, setJumlah] = useState("");
  const [keterangan, setKeterangan] = useState("");
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const selectedItem = items.find(
    (item) => item.id.toString() === selectedItemId
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedItem || !jumlah) {
      toast.error("Mohon isi semua yang diperlukan");
      return;
    }

    const jumlahNum = Number.parseInt(jumlah);
    if (isNaN(jumlahNum) || jumlahNum <= 0) {
      toast.error("Jumlah harus berupa angka positif");
      return;
    }

    if (tipe === "keluar" && jumlahNum > selectedItem.stok) {
      toast.error(`Stok tidak mencukupi. Tersedia: ${selectedItem.stok}`);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/items/${selectedItem.id}/movement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jumlah: jumlahNum,
          tipe,
          tanggal: new Date(Date.now()).toISOString(),
          keterangan: keterangan.trim(),
        }),
      });

      if (response.ok) {
        onSuccess();
        setSelectedItemId("");
        setTipe("masuk");
        setJumlah("");
        setKeterangan("");
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to add movement");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menambah transaksi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Tambah Transaksi Barang</DialogTitle>
          <DialogDescription>
            Catat transaksi barang baru (masuk atau keluar inventaris).
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="item">Item *</Label>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="justify-between"
                  >
                    {selectedItem
                      ? `${selectedItem.kode} - ${selectedItem.nama} (Stok: ${selectedItem.stok})`
                      : "Pilih item"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[400px] p-0">
                  <Command>
                    <CommandInput placeholder="Cari item..." />
                    <CommandList className="max-h-[200px] overflow-y-auto">
                      <CommandEmpty>Tidak ada item ditemukan.</CommandEmpty>
                      <CommandGroup>
                        {items.map((item) => (
                          <CommandItem
                            key={item.id}
                            value={`${item.kode} ${item.nama}`.toLowerCase()}
                            onSelect={() => {
                              setSelectedItemId(item.id.toString());
                              setPopoverOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedItemId === item.id.toString()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {item.kode} - {item.nama} (Stok: {item.stok})
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipe">Jenis Transaksi *</Label>
              <Select
                value={tipe}
                onValueChange={(value: "masuk" | "keluar") => setTipe(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masuk">Masuk</SelectItem>
                  <SelectItem value="keluar">Keluar</SelectItem>
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
              {selectedItem && tipe === "keluar" && (
                <p className="text-sm text-muted-foreground">
                  Stok tersedia: {selectedItem.stok}
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keterangan">Keterangan</Label>
              <Textarea
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Keterangan (opsional)"
                rows={3}
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
              {loading ? "Menambahkan..." : "Tambah Pergerakan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
