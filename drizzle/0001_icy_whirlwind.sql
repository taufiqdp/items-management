ALTER TABLE "item" RENAME COLUMN "harga" TO "harga_beli";--> statement-breakpoint
ALTER TABLE "item_movement" ALTER COLUMN "tanggal" SET DATA TYPE timestamp with time zone;--> statement-breakpoint
ALTER TABLE "item_movement" ALTER COLUMN "tanggal" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "harga_jual" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "item" ADD COLUMN "kategori" varchar NOT NULL;