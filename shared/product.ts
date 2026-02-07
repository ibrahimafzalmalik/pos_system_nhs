import { z } from "zod";

export const Unit = ["PCS", "KG", "LITER"] as const;
export type Unit = (typeof Unit)[number];

export const Status = ["ACTIVE", "INACTIVE"] as const;
export type Status = (typeof Status)[number];

export interface Product {
  id: number;
  name: string;
  sku?: string;
  barcode?: string;
  unit: Unit;
  costPrice: number;
  salePrice: number;
  quantity: number;
  minStock: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export function normalizeOptionalString(s: string | undefined): string | undefined {
  if (s === undefined || s === null) return undefined;
  const t = s.trim();
  return t === "" ? undefined : t;
}

const optionalStringSchema = z
  .string()
  .optional()
  .transform((v) => (v === undefined ? undefined : normalizeOptionalString(v)));

export const ProductCreateSchema = z.object({
  name: z.string().min(2),
  sku: optionalStringSchema,
  barcode: optionalStringSchema,
  unit: z.enum(Unit).default("PCS"),
  costPrice: z.number().min(0),
  salePrice: z.number().min(0),
  minStock: z.number().min(0),
  status: z.enum(Status).default("ACTIVE"),
});

export type ProductCreate = z.infer<typeof ProductCreateSchema>;

export const ProductUpdateSchema = ProductCreateSchema.partial().extend({
  id: z.number(),
});

export type ProductUpdate = z.infer<typeof ProductUpdateSchema>;

export const ProductQuerySchema = z.object({
  q: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "ALL"]).optional(),
});

export type ProductQuery = z.infer<typeof ProductQuerySchema>;
