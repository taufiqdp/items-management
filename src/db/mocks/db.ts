import { Item, ItemMovement } from "@/db/schema";
import { vi } from "vitest";

// Mock values for items and movements for testing purposes
export const mockItems: Item[] = [
  {
    id: 1,
    kode: "ITEM001",
    nama: "Test Item 1",
    hargaBeli: 100,
    hargaJual: 150,
    kategori: "Electronics",
    stok: 10,
  },
  {
    id: 2,
    kode: "ITEM002",
    nama: "Test Item 2",
    hargaBeli: 50,
    hargaJual: 75,
    kategori: "Food",
    stok: 5,
  },
];

export const mockMovements: ItemMovement[] = [
  {
    id: 101,
    itemKode: "ITEM001",
    jumlah: 5,
    tipe: "masuk",
    tanggal: new Date("2023-01-01:00:00:00"),
    keterangan: "Initial stock",
  },
  {
    id: 102,
    itemKode: "ITEM001",
    jumlah: 2,
    tipe: "keluar",
    tanggal: new Date("2023-01-02:00:00:00"),
    keterangan: "Sold to customer",
  },
];

// Generic mock for the `db` object
export const mockDb = {
  select: vi.fn(() => mockDb), // Chainable for select
  from: vi.fn((table) => {
    if (table.tableName === "item") {
      return mockDb; // Return itself to allow chaining .where()
    }
    if (table.tableName === "item_movement") {
      return mockDb; // Return itself to allow chaining .where()
    }
    return mockDb;
  }),
  where: vi.fn(() => mockDb), // Chainable for where
  eq: vi.fn((column, value) => {
    // This is a simplified mock for eq. In real scenarios, you might need
    // more sophisticated logic to filter mock data based on columns.
    return { column, value };
  }),
  insert: vi.fn(() => mockDb), // Chainable for insert
  values: vi.fn(() => mockDb), // Chainable for values
  update: vi.fn(() => mockDb), // Chainable for update
  set: vi.fn(() => mockDb), // Chainable for set
  delete: vi.fn(() => mockDb), // Chainable for delete
  returning: vi.fn(), // The final call that returns the data
};

// Mock the actual db module in your tests
vi.mock("@/index", () => ({
  db: mockDb,
}));

// Export mock data for easy access in tests
export { itemTable, itemMovementTable } from "@/db/schema"; // Re-export actual schema tables if needed
