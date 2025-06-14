"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Plus, ArrowUp, ArrowDown, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { AddMovementDialog } from "@/components/add-movement-dialog"
import { toast } from "sonner"

interface Item {
  id: number
  kode: string
  nama: string
  harga: number
  stok: number
}

interface Movement {
  id: number
  itemKode: string
  jumlah: number
  tipe: "masuk" | "keluar"
  tanggal: string
  keterangan: string
  item?: Item
}

export default function ItemMovementPage() {
  const [movements, setMovements] = useState<Movement[]>([])
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDialog, setShowAddDialog] = useState(false)

  const today = format(new Date(), "yyyy-MM-dd")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [movementsRes, itemsRes] = await Promise.all([fetch("/api/movements"), fetch("/api/items")])

      if (movementsRes.ok) {
        const movementsData = await movementsRes.json()
        setMovements(movementsData)
      }

      if (itemsRes.ok) {
        const itemsData = await itemsRes.json()
        setItems(itemsData)
      }
    } catch (error) {
      toast.error("Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const todayMovements = movements.filter((movement) => movement.tanggal === today)

  const totalIn = todayMovements.filter((m) => m.tipe === "masuk").reduce((sum, m) => sum + m.jumlah, 0)

  const totalOut = todayMovements.filter((m) => m.tipe === "keluar").reduce((sum, m) => sum + m.jumlah, 0)

  const getItemName = (kode: string) => {
    const item = items.find((item) => item.kode === kode)
    return item ? item.nama : kode
  }

  const handleMovementAdded = () => {
    fetchData()
    setShowAddDialog(false)
    toast.success("Movement added successfully")
  }

  if (loading) {
    return (
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold">Item Movement</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-1/2"></div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    )
  }

  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <h1 className="text-lg font-semibold">Item Movement</h1>
        </div>
        <div className="ml-auto">
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Movement
          </Button>
        </div>
      </header>

      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Today's Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Items In</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalIn}</div>
              <p className="text-xs text-muted-foreground">Items received today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Items Out</CardTitle>
              <ArrowDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{totalOut}</div>
              <p className="text-xs text-muted-foreground">Items dispatched today</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Movement</CardTitle>
              <Calendar className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totalIn - totalOut >= 0 ? "text-green-600" : "text-red-600"}`}>
                {totalIn - totalOut >= 0 ? "+" : ""}
                {totalIn - totalOut}
              </div>
              <p className="text-xs text-muted-foreground">Net change today</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Movements Table */}
        <Card>
          <CardHeader>
            <CardTitle>Today's Movements</CardTitle>
            <CardDescription>All item movements for {format(new Date(), "MMMM d, yyyy")}</CardDescription>
          </CardHeader>
          <CardContent>
            {todayMovements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No movements recorded for today</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todayMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-mono">{movement.itemKode}</TableCell>
                      <TableCell>{getItemName(movement.itemKode)}</TableCell>
                      <TableCell>
                        <Badge variant={movement.tipe === "masuk" ? "default" : "destructive"}>
                          {movement.tipe === "masuk" ? (
                            <>
                              <ArrowUp className="h-3 w-3 mr-1" />
                              In
                            </>
                          ) : (
                            <>
                              <ArrowDown className="h-3 w-3 mr-1" />
                              Out
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{movement.jumlah}</TableCell>
                      <TableCell>{movement.keterangan || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{format(new Date(), "HH:mm")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recent Movements */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Movements</CardTitle>
            <CardDescription>Latest 10 item movements across all dates</CardDescription>
          </CardHeader>
          <CardContent>
            {movements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No movements recorded yet</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Item Code</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.slice(0, 10).map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell>{format(new Date(movement.tanggal), "MMM d, yyyy")}</TableCell>
                      <TableCell className="font-mono">{movement.itemKode}</TableCell>
                      <TableCell>{getItemName(movement.itemKode)}</TableCell>
                      <TableCell>
                        <Badge variant={movement.tipe === "masuk" ? "default" : "destructive"}>
                          {movement.tipe === "masuk" ? (
                            <>
                              <ArrowUp className="h-3 w-3 mr-1" />
                              In
                            </>
                          ) : (
                            <>
                              <ArrowDown className="h-3 w-3 mr-1" />
                              Out
                            </>
                          )}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">{movement.jumlah}</TableCell>
                      <TableCell>{movement.keterangan || "-"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      <AddMovementDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        items={items}
        onSuccess={handleMovementAdded}
      />
    </SidebarInset>
  )
}
