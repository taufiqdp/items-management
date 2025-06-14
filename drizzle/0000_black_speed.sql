CREATE TABLE "item_movement" (
	"id" serial PRIMARY KEY NOT NULL,
	"item_kode" varchar NOT NULL,
	"jumlah" integer NOT NULL,
	"tipe" varchar NOT NULL,
	"tanggal" date NOT NULL,
	"keterangan" text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "item" (
	"id" serial PRIMARY KEY NOT NULL,
	"kode" varchar NOT NULL,
	"nama" text NOT NULL,
	"harga" integer NOT NULL,
	"stok" integer NOT NULL,
	CONSTRAINT "item_kode_unique" UNIQUE("kode")
);
--> statement-breakpoint
ALTER TABLE "item_movement" ADD CONSTRAINT "item_movement_item_kode_item_kode_fk" FOREIGN KEY ("item_kode") REFERENCES "public"."item"("kode") ON DELETE cascade ON UPDATE no action;