import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Item } from "@/db/schema";

export default function ItemTable({
  searchQuery,
  setEditingItem,
  setDeletingItem,
  filteredItems,
}: {
  searchQuery: string;
  setEditingItem: (item: Item) => void;
  setDeletingItem: (item: Item) => void;
  filteredItems: Item[];
}) {
  const getStockStatus = (stok: number) => {
    if (stok === 0)
      return { label: "Stok Habis", variant: "destructive" as const };
    if (stok < 10)
      return { label: "Stok Rendah", variant: "secondary" as const };
    return { label: "Stok Tersedia", variant: "default" as const };
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Barang Inventaris</CardTitle>
        <CardDescription>Kelola barang inventaris</CardDescription>
      </CardHeader>
      <CardContent>
        {filteredItems.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchQuery
              ? "Tidak ada barang yang cocok dengan pencarian Anda"
              : "Tidak ada barang dalam inventaris"}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Harga Beli</TableHead>
                <TableHead>Harga Jual</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Nilai Total</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => {
                const stockStatus = getStockStatus(item.stok);
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.kode}</TableCell>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.kategori}</Badge>
                    </TableCell>
                    <TableCell>
                      Rp {item.hargaBeli.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      Rp {item.hargaJual.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="font-semibold">{item.stok}</TableCell>
                    <TableCell>
                      <Badge variant={stockStatus.variant}>
                        {stockStatus.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      Rp {(item.hargaJual * item.stok).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingItem(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingItem(item)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
