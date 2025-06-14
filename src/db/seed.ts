import { drizzle } from "drizzle-orm/postgres-js";
import { ItemInsert, itemTable } from "./schema";
import postgres from "postgres";
import "dotenv/config";
import { config } from "dotenv";
config();

const sql = postgres(process.env.DATABASE_URL!);
const db = drizzle(sql);

const seedData: ItemInsert[] = [
  {
    kode: "BR001",
    nama: "Laptop Gaming ASUS",
    hargaBeli: 13000000,
    hargaJual: 15000000,
    kategori: "Laptop",
    stok: 5,
  },
  {
    kode: "BR002",
    nama: "Mouse Wireless Logitech",
    hargaBeli: 200000,
    hargaJual: 250000,
    kategori: "Aksesoris",
    stok: 25,
  },
  {
    kode: "BR003",
    nama: "Keyboard Mechanical RGB",
    hargaBeli: 650000,
    hargaJual: 800000,
    kategori: "Aksesoris",
    stok: 15,
  },
  {
    kode: "BR004",
    nama: "Monitor 24 inch Full HD",
    hargaBeli: 2000000,
    hargaJual: 2500000,
    kategori: "Monitor",
    stok: 8,
  },
  {
    kode: "BR005",
    nama: "Headset Gaming Razer",
    hargaBeli: 950000,
    hargaJual: 1200000,
    kategori: "Audio",
    stok: 12,
  },
  {
    kode: "BR006",
    nama: "Webcam HD 1080p",
    hargaBeli: 450000,
    hargaJual: 600000,
    kategori: "Kamera",
    stok: 18,
  },
  {
    kode: "BR007",
    nama: "SSD 1TB Samsung",
    hargaBeli: 1400000,
    hargaJual: 1800000,
    kategori: "Storage",
    stok: 10,
  },
  {
    kode: "BR008",
    nama: "RAM DDR4 16GB Corsair",
    hargaBeli: 1200000,
    hargaJual: 1500000,
    kategori: "Memory",
    stok: 20,
  },
  {
    kode: "BR009",
    nama: "Mousepad Gaming XL",
    hargaBeli: 100000,
    hargaJual: 150000,
    kategori: "Aksesoris",
    stok: 30,
  },
  {
    kode: "BR010",
    nama: "Speaker Bluetooth JBL",
    hargaBeli: 600000,
    hargaJual: 800000,
    kategori: "Audio",
    stok: 14,
  },
  {
    kode: "BR011",
    nama: "Power Bank 20000mAh",
    hargaBeli: 300000,
    hargaJual: 400000,
    kategori: "Power",
    stok: 22,
  },
  {
    kode: "BR012",
    nama: "USB Flash Drive 64GB",
    hargaBeli: 80000,
    hargaJual: 120000,
    kategori: "Storage",
    stok: 35,
  },
  {
    kode: "BR013",
    nama: "Printer Inkjet Canon",
    hargaBeli: 1400000,
    hargaJual: 1800000,
    kategori: "Printer",
    stok: 6,
  },
  {
    kode: "BR014",
    nama: "Router WiFi 6 TP-Link",
    hargaBeli: 700000,
    hargaJual: 900000,
    kategori: "Network",
    stok: 11,
  },
  {
    kode: "BR015",
    nama: "Cable HDMI 2m",
    hargaBeli: 50000,
    hargaJual: 80000,
    kategori: "Kabel",
    stok: 40,
  },
  {
    kode: "BR016",
    nama: "Phone Case iPhone 14",
    hargaBeli: 150000,
    hargaJual: 200000,
    kategori: "Aksesoris",
    stok: 28,
  },
  {
    kode: "BR017",
    nama: "Tablet Android 10 inch",
    hargaBeli: 2800000,
    hargaJual: 3500000,
    kategori: "Tablet",
    stok: 7,
  },
  {
    kode: "BR018",
    nama: "Smartwatch Samsung",
    hargaBeli: 2200000,
    hargaJual: 2800000,
    kategori: "Wearable",
    stok: 9,
  },
  {
    kode: "BR019",
    nama: "Earbuds True Wireless",
    hargaBeli: 950000,
    hargaJual: 1200000,
    kategori: "Audio",
    stok: 16,
  },
  {
    kode: "BR020",
    nama: "Laptop Stand Aluminum",
    hargaBeli: 250000,
    hargaJual: 350000,
    kategori: "Aksesoris",
    stok: 24,
  },
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
