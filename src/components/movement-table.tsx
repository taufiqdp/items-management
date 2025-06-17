import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { format } from "date-fns";
import { Item, ItemMovement } from "@/db/schema";
import TypeBadge from "./type-badge";
import { id } from "date-fns/locale";
import { Button } from "./ui/button";
import { Edit, Trash2 } from "lucide-react";

export default function MovementTable({
  movements,
  items,
  setEditingMovement,
  setDeletingMovement,
}: {
  movements: ItemMovement[];
  items: Item[];
  setEditingMovement: (movement: ItemMovement) => void;
  setDeletingMovement: (movement: ItemMovement) => void;
}) {
  const today = format(new Date(Date.now()), "yyyy-MM-dd");
  console.log("Today:", today);

  const getItemName = (kode: string) => {
    const item = items.find((item) => item.kode === kode);
    return item ? item.nama : kode;
  };

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Hari Ini</CardTitle>
        <CardDescription>
          Semua transaksi barang untuk{" "}
          {format(new Date(), "MMMM d, yyyy", { locale: id })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedMovements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Tidak ada transaksi yang tercatat untuk hari ini
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode Barang</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Jenis</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Waktu</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedMovements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell className="font-mono">
                    {movement.itemKode}
                  </TableCell>
                  <TableCell>{getItemName(movement.itemKode)}</TableCell>
                  <TableCell>
                    <TypeBadge movement={movement} />
                  </TableCell>
                  <TableCell className="font-semibold">
                    {movement.jumlah}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(movement.tanggal), "HH:mm")}
                  </TableCell>
                  <TableCell>
                    {movement.harga
                      ? movement.harga.toLocaleString("id-ID")
                      : "-"}
                  </TableCell>
                  <TableCell>{movement.keterangan || "-"}</TableCell>

                  <TableCell className="text-left">
                    <div className="gap-2 flex justify-start">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingMovement(movement)}
                        className="hover:bg-green-100 hover:text-green-800 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingMovement(movement)}
                        className="hover:bg-red-100 hover:text-red-800 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
