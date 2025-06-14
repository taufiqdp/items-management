"use client"

import type React from "react"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

interface AddItemDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function AddItemDialog({ open, onOpenChange, onSuccess }: AddItemDialogProps) {
  const [kode, setKode] = useState("")
  const [nama, setNama] = useState("")
  const [harga, setHarga] = useState("")
  const [stok, setStok] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!kode || !nama || !harga || !stok) {
      toast.error("Please fill in all fields")
      return
    }

    const hargaNum = Number.parseInt(harga)
    const stokNum = Number.parseInt(stok)

    if (isNaN(hargaNum) || hargaNum < 0) {
      toast.error("Price must be a valid number")
      return
    }

    if (isNaN(stokNum) || stokNum < 0) {
      toast.error("Stock must be a valid number")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kode: kode.trim(),
          nama: nama.trim(),
          harga: hargaNum,
          stok: stokNum,
        }),
      })

      if (response.ok) {
        onSuccess()
        // Reset form
        setKode("")
        setNama("")
        setHarga("")
        setStok("")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to add item")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
          <DialogDescription>Add a new item to your inventory.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="kode">Item Code *</Label>
              <Input
                id="kode"
                value={kode}
                onChange={(e) => setKode(e.target.value)}
                placeholder="Enter unique item code"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="nama">Item Name *</Label>
              <Input id="nama" value={nama} onChange={(e) => setNama(e.target.value)} placeholder="Enter item name" />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="harga">Price (Rp) *</Label>
              <Input
                id="harga"
                type="number"
                min="0"
                value={harga}
                onChange={(e) => setHarga(e.target.value)}
                placeholder="Enter price"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="stok">Initial Stock *</Label>
              <Input
                id="stok"
                type="number"
                min="0"
                value={stok}
                onChange={(e) => setStok(e.target.value)}
                placeholder="Enter initial stock quantity"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
