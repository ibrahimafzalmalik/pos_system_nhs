import { getDb } from "./db";
import type { Product, ProductCreate, ProductQuery, ProductUpdate, Status } from "../../../shared/product";
import {
  ProductCreateSchema,
  ProductQuerySchema,
  ProductUpdateSchema,
} from "../../../shared/product";

type Row = {
  id: number;
  name: string;
  sku: string | null;
  barcode: string | null;
  unit: string;
  cost_price: number;
  sale_price: number;
  quantity: number;
  min_stock: number;
  status: string;
  created_at: string;
  updated_at: string;
};

function rowToProduct(r: Row): Product {
  return {
    id: r.id,
    name: r.name,
    sku: r.sku ?? undefined,
    barcode: r.barcode ?? undefined,
    unit: r.unit as Product["unit"],
    costPrice: r.cost_price,
    salePrice: r.sale_price,
    quantity: r.quantity,
    minStock: r.min_stock,
    status: r.status as Product["status"],
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

function listProducts(query: ProductQuery = {}): Product[] {
  const parsed = ProductQuerySchema.parse(query);
  const status = parsed.status ?? "ACTIVE";
  const q = parsed.q?.trim();
  const db = getDb();

  let sql = "SELECT * FROM products WHERE 1=1";
  const params: (string | number)[] = [];

  if (q) {
    sql += " AND (name LIKE ? OR sku LIKE ? OR barcode LIKE ?)";
    const pattern = `%${q}%`;
    params.push(pattern, pattern, pattern);
  }
  if (status !== "ALL") {
    sql += " AND status = ?";
    params.push(status);
  }

  sql += " ORDER BY name ASC";

  const stmt = db.prepare(sql);
  const rows = (q || status !== "ALL" ? stmt.all(...params) : stmt.all()) as Row[];
  return rows.map(rowToProduct);
}

function getProductById(id: number): Product | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM products WHERE id = ?").get(id) as Row | undefined;
  return row ? rowToProduct(row) : null;
}

function createProduct(input: unknown): Product {
  const data = ProductCreateSchema.parse(input) as ProductCreate;
  const db = getDb();

  if (data.sku !== undefined && data.sku !== null && data.sku !== "") {
    const existing = db.prepare("SELECT id FROM products WHERE sku = ?").get(data.sku) as { id: number } | undefined;
    if (existing) throw new Error("SKU_ALREADY_EXISTS");
  }

  const run = db.transaction(() => {
    const stmt = db.prepare(`
      INSERT INTO products (name, sku, barcode, unit, cost_price, sale_price, quantity, min_stock, status)
      VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?)
    `);
    const info = stmt.run(
      data.name,
      data.sku ?? null,
      data.barcode ?? null,
      data.unit,
      data.costPrice,
      data.salePrice,
      data.minStock,
      data.status
    ) as { lastInsertRowid: number };
    const product = getProductById(Number(info.lastInsertRowid));
    if (!product) throw new Error("PRODUCT_NOT_FOUND");
    return product;
  });
  return run();
}

function updateProduct(input: unknown): Product {
  const data = ProductUpdateSchema.parse(input) as ProductUpdate;
  const db = getDb();

  const existing = getProductById(data.id);
  if (!existing) throw new Error("PRODUCT_NOT_FOUND");

  const run = db.transaction(() => {
    const updates: string[] = [];
    const params: (string | number | null)[] = [];

    if (data.name !== undefined) {
      updates.push("name = ?");
      params.push(data.name);
    }
    if (data.sku !== undefined) {
      updates.push("sku = ?");
      params.push(data.sku ?? null);
    }
    if (data.barcode !== undefined) {
      updates.push("barcode = ?");
      params.push(data.barcode ?? null);
    }
    if (data.unit !== undefined) {
      updates.push("unit = ?");
      params.push(data.unit);
    }
    if (data.costPrice !== undefined) {
      updates.push("cost_price = ?");
      params.push(data.costPrice);
    }
    if (data.salePrice !== undefined) {
      updates.push("sale_price = ?");
      params.push(data.salePrice);
    }
    if (data.minStock !== undefined) {
      updates.push("min_stock = ?");
      params.push(data.minStock);
    }
    if (data.status !== undefined) {
      updates.push("status = ?");
      params.push(data.status);
    }

    if (updates.length === 0) return existing;

    updates.push("updated_at = datetime('now')");
    params.push(data.id);
    const sql = `UPDATE products SET ${updates.join(", ")} WHERE id = ?`;
    db.prepare(sql).run(...params);
    const product = getProductById(data.id);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");
    return product;
  });
  return run();
}

function setProductStatus(id: number, status: Status): Product {
  const db = getDb();
  const existing = getProductById(id);
  if (!existing) throw new Error("PRODUCT_NOT_FOUND");
  db.prepare("UPDATE products SET status = ?, updated_at = datetime('now') WHERE id = ?").run(status, id);
  const product = getProductById(id);
  if (!product) throw new Error("PRODUCT_NOT_FOUND");
  return product;
}

function deleteProduct(id: number): void {
  const db = getDb();
  const existing = getProductById(id);
  if (!existing) throw new Error("PRODUCT_NOT_FOUND");
  if (existing.quantity !== 0) throw new Error("PRODUCT_HAS_QUANTITY");
  db.prepare("DELETE FROM products WHERE id = ?").run(id);
}

export const productsRepo = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  setProductStatus,
  deleteProduct,
};
