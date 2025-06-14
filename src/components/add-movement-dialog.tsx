"use client"

import type React from "react"

import { useState } from "react"
import { format } from "date-fns"

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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface Item {
  id: number
  kode: string
  nama: string
  harga: number
  stok: number
}

interface AddMovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: Item[]
  onSuccess: () => void
}

export function AddMovementDialog({ open, onOpenChange, items, onSuccess }: AddMovementDialogProps) {
  const [selectedItemId, setSelectedItemId] = useState("")
  const [tipe, setTipe] = useState<"masuk" | "keluar">("masuk")
  const [jumlah, setJumlah] = useState("")
  const [keterangan, setKeterangan] = useState("")
  const [loading, setLoading] = useState(false)

  const selectedItem = items.find((item) => item.id.toString() === selectedItemId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedItem || !jumlah) {
      toast.error("Please fill in all required fields")
      return
    }

    const jumlahNum = Number.parseInt(jumlah)
    if (isNaN(jumlahNum) || jumlahNum <= 0) {
      toast.error("Quantity must be a positive number")
      return
    }

    if (tipe === "keluar" && jumlahNum > selectedItem.stok) {
      toast.error(`Insufficient stock. Available: ${selectedItem.stok}`)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/items/${selectedItem.id}/movement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jumlah: jumlahNum,
          tipe,
          tanggal: format(new Date(), "yyyy-MM-dd"),
          keterangan: keterangan.trim(),
        }),
      })

      if (response.ok) {
        onSuccess()
        // Reset form
        setSelectedItemId("")
        setTipe("masuk")
        setJumlah("")
        setKeterangan("")
      } else {
        const error = await response.json()
        throw new Error(error.message || "Failed to add movement")
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to add movement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Item Movement</DialogTitle>
          <DialogDescription>Record a new item movement (in or out of inventory).</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="item">Item *</Label>
              <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.kode} - {item.nama} (Stock: {item.stok})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="tipe">Movement Type *</Label>
              <Select value={tipe} onValueChange={(value: "masuk" | "keluar") => setTipe(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="masuk">In (Masuk)</SelectItem>
                  <SelectItem value="keluar">Out (Keluar)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jumlah">Quantity *</Label>
              <Input
                id="jumlah"
                type="number"
                min="1"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                placeholder="Enter quantity"
              />
              {selectedItem && tipe === "keluar" && (
                <p className="text-sm text-muted-foreground">Available stock: {selectedItem.stok}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="keterangan">Description</Label>
              <Textarea
                id="keterangan"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                placeholder="Optional description"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Movement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
