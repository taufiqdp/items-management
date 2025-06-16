"use client";

import { useState, useMemo } from "react";
import {
  CalendarIcon,
  Filter,
  Search,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ItemMovement } from "@/db/schema";
import TypeBadge from "./type-badge";

export default function MovementHistory({
  movements,
}: {
  movements: ItemMovement[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [sortBy, setSortBy] = useState("tanggal");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const filteredAndSortedMovements = useMemo(() => {
    const filtered = movements.filter((movement) => {
      // Search filter
      const matchesSearch =
        movement.itemKode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movement.keterangan.toLowerCase().includes(searchTerm.toLowerCase());

      // Type filter
      const matchesType =
        selectedType === "all" || movement.tipe === selectedType;

      // Date range filter
      const movementDate = new Date(movement.tanggal);
      const fromDate = dateFrom
        ? new Date(
            dateFrom.getFullYear(),
            dateFrom.getMonth(),
            dateFrom.getDate()
          )
        : null;
      const toDate = dateTo
        ? new Date(
            dateTo.getFullYear(),
            dateTo.getMonth(),
            dateTo.getDate(),
            23,
            59,
            59
          )
        : null;

      const matchesDateRange =
        (!fromDate || movementDate >= fromDate) &&
        (!toDate || movementDate <= toDate);

      return matchesSearch && matchesType && matchesDateRange;
    });

    // Sort
    filtered.sort((a, b) => {
      let aValue: string | number | Date, bValue: string | number | Date;

      switch (sortBy) {
        case "tanggal":
          aValue = a.tanggal;
          bValue = b.tanggal;
          break;
        case "jumlah":
          aValue = a.jumlah;
          bValue = b.jumlah;
          break;
        case "itemKode":
          aValue = a.itemKode;
          bValue = b.itemKode;
          break;
        default:
          aValue = a.tanggal;
          bValue = b.tanggal;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [
    movements,
    searchTerm,
    selectedType,
    dateFrom,
    dateTo,
    sortBy,
    sortOrder,
  ]);

  // Calculate summary statistics
  const stats = useMemo(() => {
    const masuk = filteredAndSortedMovements.filter((m) => m.tipe === "masuk");
    const keluar = filteredAndSortedMovements.filter(
      (m) => m.tipe === "keluar"
    );
    const rusak = filteredAndSortedMovements.filter((m) => m.tipe === "rusak");

    return {
      totalMasuk: masuk.reduce((sum, m) => sum + m.jumlah, 0),
      totalKeluar: keluar.reduce((sum, m) => sum + m.jumlah, 0),
      totalRusak: rusak.reduce((sum, m) => sum + m.jumlah, 0),
      countMasuk: masuk.length,
      countKeluar: keluar.length,
      countRusak: rusak.length,
    };
  }, [filteredAndSortedMovements]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedType("all");
    setDateFrom(undefined);
    setDateTo(undefined);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Masuk</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalMasuk}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.countMasuk} transaksi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Keluar</CardTitle>
            <TrendingDown className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.totalKeluar}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.countKeluar} transaksi
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rusak</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.totalRusak}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.countRusak} transaksi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label htmlFor="search">Cari Item/Keterangan</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Cari kode item atau keterangan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="space-y-2">
              <Label>Tipe Pergerakan</Label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="masuk">Masuk</SelectItem>
                  <SelectItem value="keluar">Keluar</SelectItem>
                  <SelectItem value="rusak">Rusak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>Tanggal Dari</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFrom && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom
                      ? format(dateFrom, "dd/MM/yyyy")
                      : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Tanggal Sampai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateTo && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, "dd/MM/yyyy") : "Pilih tanggal"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            {/* Sort Options */}
            <div className="flex gap-2 items-center">
              <Label>Urutkan:</Label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tanggal">Tanggal</SelectItem>
                  <SelectItem value="jumlah">Jumlah</SelectItem>
                  <SelectItem value="itemKode">Kode Item</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortOrder}
                onValueChange={(value: "asc" | "desc") => setSortOrder(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Naik</SelectItem>
                  <SelectItem value="asc">Turun</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <Button variant="outline" onClick={clearFilters}>
              Reset Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Hasil Pencarian ({filteredAndSortedMovements.length} dari{" "}
            {movements.length} transaksi)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Jenis</TableHead>
                  <TableHead className="text-right">Jumlah</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Jam</TableHead>
                  <TableHead>Keterangan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedMovements.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Tidak ada data yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAndSortedMovements.map((movement) => (
                    <TableRow key={movement.id}>
                      <TableCell className="font-medium">
                        #{movement.id}
                      </TableCell>
                      <TableCell className="font-mono">
                        {movement.itemKode}
                      </TableCell>
                      <TableCell>
                        <TypeBadge movement={movement} />
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {movement.jumlah.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        {format(movement.tanggal, "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell>{format(movement.tanggal, "HH:mm")}</TableCell>
                      <TableCell
                        className="max-w-xs truncate"
                        title={movement.keterangan}
                      >
                        {movement.keterangan}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
