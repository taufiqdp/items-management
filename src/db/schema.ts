import {
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
  hargaBeli: integer("harga_beli").notNull(),
  hargaJual: integer("harga_jual").notNull(),
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
});

export type Item = typeof itemTable.$inferSelect;
export type ItemMovement = typeof itemMovementTable.$inferSelect;
export type ItemInsert = typeof itemTable.$inferInsert;
export type ItemMovementInsert = typeof itemMovementTable.$inferInsert;
