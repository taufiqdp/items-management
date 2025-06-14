import { drizzle } from "drizzle-orm/postgres-js";
import { ItemInsert, itemTable } from "./schema";
import postgres from "postgres";
import "dotenv/config";
import { config } from "dotenv";
config();

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

const seedData: ItemInsert[] = [
  { kode: "BR001", nama: "Laptop Gaming ASUS", harga: 15000000, stok: 5 },
  { kode: "BR002", nama: "Mouse Wireless Logitech", harga: 250000, stok: 25 },
  { kode: "BR003", nama: "Keyboard Mechanical RGB", harga: 800000, stok: 15 },
  { kode: "BR004", nama: "Monitor 24 inch Full HD", harga: 2500000, stok: 8 },
  { kode: "BR005", nama: "Headset Gaming Razer", harga: 1200000, stok: 12 },
  { kode: "BR006", nama: "Webcam HD 1080p", harga: 600000, stok: 18 },
  { kode: "BR007", nama: "SSD 1TB Samsung", harga: 1800000, stok: 10 },
  { kode: "BR008", nama: "RAM DDR4 16GB Corsair", harga: 1500000, stok: 20 },
  { kode: "BR009", nama: "Mousepad Gaming XL", harga: 150000, stok: 30 },
  { kode: "BR010", nama: "Speaker Bluetooth JBL", harga: 800000, stok: 14 },
  { kode: "BR011", nama: "Power Bank 20000mAh", harga: 400000, stok: 22 },
  { kode: "BR012", nama: "USB Flash Drive 64GB", harga: 120000, stok: 35 },
  { kode: "BR013", nama: "Printer Inkjet Canon", harga: 1800000, stok: 6 },
  { kode: "BR014", nama: "Router WiFi 6 TP-Link", harga: 900000, stok: 11 },
  { kode: "BR015", nama: "Cable HDMI 2m", harga: 80000, stok: 40 },
  { kode: "BR016", nama: "Phone Case iPhone 14", harga: 200000, stok: 28 },
  { kode: "BR017", nama: "Tablet Android 10 inch", harga: 3500000, stok: 7 },
  { kode: "BR018", nama: "Smartwatch Samsung", harga: 2800000, stok: 9 },
  { kode: "BR019", nama: "Earbuds True Wireless", harga: 1200000, stok: 16 },
  { kode: "BR020", nama: "Laptop Stand Aluminum", harga: 350000, stok: 24 },
];

async function seed() {
  try {
    console.log("Starting seed...");

    await db.insert(itemTable).values(seedData);

    console.log("Seed completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await sql.end();
  }
}

seed();
