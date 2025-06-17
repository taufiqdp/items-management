ALTER TABLE "item" ALTER COLUMN "harga_beli" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "item" ALTER COLUMN "harga_jual" SET DATA TYPE bigint;--> statement-breakpoint
ALTER TABLE "item_movement" ADD COLUMN "harga" bigint DEFAULT 0 NOT NULL;