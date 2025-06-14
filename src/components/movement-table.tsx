import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ArrowUp, ArrowDown } from "lucide-react";
import { format } from "date-fns";
import { Item, ItemMovement } from "@/db/schema";

export default function MovementTable({
  movements,
  items,
}: {
  movements: ItemMovement[];
  items: Item[];
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

  console.log("Sorted Movements:", sortedMovements);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Hari Ini</CardTitle>
        <CardDescription>
          Semua transaksi barang untuk {format(new Date(), "MMMM d, yyyy")}
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
                <TableHead>Keterangan</TableHead>
                <TableHead>Waktu</TableHead>
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
                    <Badge
                      variant={
                        movement.tipe === "masuk" ? "default" : "destructive"
                      }
                    >
                      {movement.tipe === "masuk" ? (
                        <>
                          <ArrowUp className="h-3 w-3 mr-1" />
                          Masuk
                        </>
                      ) : (
                        <>
                          <ArrowDown className="h-3 w-3 mr-1" />
                          Keluar
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-semibold">
                    {movement.jumlah}
                  </TableCell>
                  <TableCell>{movement.keterangan || "-"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(movement.tanggal), "HH:mm")}
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
