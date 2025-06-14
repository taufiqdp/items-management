import { Context, Hono } from "hono";
import { handle } from "hono/vercel";
import {
  Item,
  ItemInsert,
  itemTable,
  itemMovementTable,
  ItemMovementInsert,
  ItemMovement,
} from "@/db/schema";
import { eq, gte } from "drizzle-orm";
import { db } from "@/index";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

// Endpoint items
app.get("/items", async (c: Context) => {
  const items: Item[] = await db.select().from(itemTable);
  return c.json(items);
});

app.post("/items", async (c: Context) => {
  const body: ItemInsert = await c.req.json();
  const item: Item[] = await db
    .insert(itemTable)
    .values({
      kode: body.kode,
      nama: body.nama,
      hargaBeli: body.hargaBeli,
      hargaJual: body.hargaJual,
      kategori: body.kategori,
      stok: body.stok,
    })
    .returning();
  return c.json(item[0], 201);
});

app.put("/items/:id", async (c: Context) => {
  const body: ItemInsert = await c.req.json();
  const id: number = Number(c.req.param("id"));
  const item: Item[] = await db
    .update(itemTable)
    .set({
      kode: body.kode,
      nama: body.nama,
      hargaBeli: body.hargaBeli,
      hargaJual: body.hargaJual,
      kategori: body.kategori,
      stok: body.stok,
    })
    .where(eq(itemTable.id, Number(id)))
    .returning();
  if (item.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }
  return c.json(item[0]);
});

app.delete("/items/:id", async (c: Context) => {
  const id: number = Number(c.req.param("id"));
  const item: Item[] = await db
    .delete(itemTable)
    .where(eq(itemTable.id, Number(id)))
    .returning();
  if (item.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }
  return c.json(item[0]);
});

// Endpoint item movements

app.get("/items/:id/movement", async (c: Context) => {
  const id: number = Number(c.req.param("id"));
  const item: Item[] = await db
    .select()
    .from(itemTable)
    .where(eq(itemTable.id, id));
  if (item.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }
  const movements: ItemMovement[] = await db
    .select()
    .from(itemMovementTable)
    .where(eq(itemMovementTable.itemKode, item[0].kode));

  if (movements.length === 0) {
    return c.json({ error: "No movements found for this item" }, 404);
  }

  return c.json(movements);
});

app.get("/movements", async (c: Context) => {
  const dateParam = c.req.query("date");

  let movements: ItemMovement[];

  if (dateParam) {
    const startDate = new Date(dateParam);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);

    movements = await db
      .select()
      .from(itemMovementTable)
      .where(gte(itemMovementTable.tanggal, startDate));
  } else {
    movements = await db.select().from(itemMovementTable);
  }

  if (movements.length === 0) {
    return c.json({ error: "No movements found" }, 404);
  }
  return c.json(movements);
});

app.post("/items/:id/movement", async (c: Context) => {
  const body: ItemMovementInsert = await c.req.json();
  const id: number = Number(c.req.param("id"));
  const item: Item[] = await db
    .select()
    .from(itemTable)
    .where(eq(itemTable.id, id));
  if (item.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }
  const movement: ItemMovement[] = await db
    .insert(itemMovementTable)
    .values({
      itemKode: item[0].kode,
      jumlah: body.jumlah,
      tipe: body.tipe,
      tanggal: body.tanggal ? new Date(body.tanggal) : new Date(),
      keterangan: body.keterangan || "",
    })
    .returning();

  let newStok = item[0].stok;
  if (body.tipe === "masuk") {
    newStok += body.jumlah;
  } else if (body.tipe === "keluar") {
    newStok -= body.jumlah;
    if (newStok < 0) {
      return c.json({ error: "Stok tidak cukup" }, 400);
    }
  } else {
    return c.json({ error: "Tipe tidak valid" }, 400);
  }
  await db.update(itemTable).set({ stok: newStok }).where(eq(itemTable.id, id));

  return c.json(movement[0], 201);
});

app.put("/items/:id/movement/:movementId", async (c: Context) => {
  const body: ItemMovementInsert = await c.req.json();
  const id: number = Number(c.req.param("id"));
  const movementId: number = Number(c.req.param("movementId"));
  const item: Item[] = await db
    .select()
    .from(itemTable)
    .where(eq(itemTable.id, id));

  if (item.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }

  const existingMovement: ItemMovement[] = await db
    .select()
    .from(itemMovementTable)
    .where(eq(itemMovementTable.id, movementId));

  if (existingMovement.length === 0) {
    return c.json({ error: "Movement not found" }, 404);
  }

  if (item[0].kode !== existingMovement[0].itemKode) {
    return c.json({ error: "Movement does not belong to this item" }, 400);
  }

  const movement: ItemMovement[] = await db
    .update(itemMovementTable)
    .set({
      jumlah: body.jumlah,
      tipe: body.tipe,
      tanggal: body.tanggal ? new Date(body.tanggal) : new Date(),
      keterangan: body.keterangan || "",
    })
    .where(eq(itemMovementTable.id, movementId))
    .returning();

  // The returning() call might return an empty array if the where clause didn't match.
  // This check is already done by `existingMovement.length === 0` above, but keeps consistency.
  if (movement.length === 0) {
    return c.json({ error: "Movement not found" }, 404);
  }

  let newStok = item[0].stok;
  // Undo the effect of the existing movement on stock
  if (existingMovement[0].tipe === "masuk") {
    newStok -= existingMovement[0].jumlah;
  } else if (existingMovement[0].tipe === "keluar") {
    newStok += existingMovement[0].jumlah;
  }

  // Apply the effect of the new movement on stock
  if (body.tipe === "masuk") {
    newStok += body.jumlah;
  } else if (body.tipe === "keluar") {
    newStok -= body.jumlah;
    if (newStok < 0) {
      return c.json({ error: "Stok tidak cukup" }, 400);
    }
  } else {
    return c.json({ error: "Tipe tidak valid" }, 400);
  }
  await db.update(itemTable).set({ stok: newStok }).where(eq(itemTable.id, id));
  return c.json(movement[0]);
});

app.delete("/items/:id/movement/:movementId", async (c: Context) => {
  const id: number = Number(c.req.param("id"));
  const movementId: number = Number(c.req.param("movementId"));
  const item: Item[] = await db
    .select()
    .from(itemTable)
    .where(eq(itemTable.id, id));

  if (item.length === 0) {
    return c.json({ error: "Item not found" }, 404);
  }

  const existingMovement: ItemMovement[] = await db
    .select()
    .from(itemMovementTable)
    .where(eq(itemMovementTable.id, movementId));

  if (existingMovement.length === 0) {
    return c.json({ error: "Movement not found" }, 404);
  }

  if (item[0].kode !== existingMovement[0].itemKode) {
    return c.json({ error: "Movement does not belong to this item" }, 400);
  }

  const movement: ItemMovement[] = await db
    .delete(itemMovementTable)
    .where(eq(itemMovementTable.id, movementId))
    .returning();

  if (movement.length === 0) {
    return c.json({ error: "Movement not found" }, 404);
  }

  const newStok =
    item[0].stok +
    (existingMovement[0].tipe === "masuk"
      ? -existingMovement[0].jumlah
      : existingMovement[0].jumlah);

  await db.update(itemTable).set({ stok: newStok }).where(eq(itemTable.id, id));

  return c.json(movement[0]);
});

// The Vercel handle functions can remain for deployment
export const GET = handle(app);
export const PUT = handle(app);
export const POST = handle(app);
export const DELETE = handle(app);

export type AppType = typeof app;
