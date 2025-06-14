import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowUp, ArrowDown, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ItemMovement } from "@/db/schema";

export default function MovementCards({
  movements,
}: {
  movements: ItemMovement[];
}) {
  const today = format(new Date(), "yyyy-MM-dd");

  const todayMovements = movements.filter(
    (movement) => format(movement.tanggal, "yyyy-MM-dd") === today
  );

  const totalIn = todayMovements
    .filter((m) => m.tipe === "masuk")
    .reduce((sum, m) => sum + m.jumlah, 0);

  const totalOut = todayMovements
    .filter((m) => m.tipe === "keluar")
    .reduce((sum, m) => sum + m.jumlah, 0);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Barang Masuk Hari Ini
          </CardTitle>
          <ArrowUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{totalIn}</div>
          <p className="text-xs text-muted-foreground">
            Barang diterima hari ini
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Barang Keluar Hari Ini
          </CardTitle>
          <ArrowDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{totalOut}</div>
          <p className="text-xs text-muted-foreground">
            Barang dikirim hari ini
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pergerakan Bersih
          </CardTitle>
          <Calendar className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              totalIn - totalOut >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {totalIn - totalOut >= 0 ? "+" : ""}
            {totalIn - totalOut}
          </div>
          <p className="text-xs text-muted-foreground">
            Perubahan bersih hari ini
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
