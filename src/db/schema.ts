import {
  date,
  integer,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const itemTable = pgTable("item", {
  id: serial("id").primaryKey(),
  kode: varchar("kode").notNull().unique(),
  nama: text("nama").notNull(),
  harga: integer("harga").notNull(),
  stok: integer("stok").notNull(),
});

export const itemMovementTable = pgTable("item_movement", {
  id: serial("id").primaryKey(),
  itemKode: varchar("item_kode")
    .notNull()
    .references(() => itemTable.kode, { onDelete: "cascade" }),
  jumlah: integer("jumlah").notNull(),
  tipe: varchar("tipe", { enum: ["masuk", "keluar"] }).notNull(),
  tanggal: date("tanggal").notNull(),
  keterangan: text("keterangan").notNull().default(""),
});

export type Item = typeof itemTable.$inferSelect;
export type ItemMovement = typeof itemMovementTable.$inferSelect;
export type ItemInsert = typeof itemTable.$inferInsert;
export type ItemMovementInsert = typeof itemMovementTable.$inferInsert;
