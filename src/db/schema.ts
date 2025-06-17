import {
  bigint,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const itemTable = pgTable("item", {
  id: serial("id").primaryKey(),
  kode: varchar("kode").notNull().unique(),
  nama: text("nama").notNull(),
  hargaBeli: bigint("harga_beli", { mode: "number" }).notNull(),
  hargaJual: bigint("harga_jual", { mode: "number" }).notNull(),
  kategori: varchar("kategori").notNull(),
  stok: integer("stok").notNull(),
});

export const itemMovementTable = pgTable("item_movement", {
  id: serial("id").primaryKey(),
  itemKode: varchar("item_kode")
    .notNull()
    .references(() => itemTable.kode, { onDelete: "cascade" }),
  jumlah: integer("jumlah").notNull(),
  tipe: varchar("tipe", { enum: ["masuk", "keluar", "rusak"] }).notNull(),
  tanggal: timestamp("tanggal", { withTimezone: true }).notNull().defaultNow(),
  keterangan: text("keterangan").notNull().default(""),
  harga: bigint("harga", { mode: "number" }).notNull().default(0),
});

export type Item = typeof itemTable.$inferSelect;
export type ItemMovement = typeof itemMovementTable.$inferSelect;
export type ItemInsert = typeof itemTable.$inferInsert;
export type ItemMovementInsert = typeof itemMovementTable.$inferInsert;
