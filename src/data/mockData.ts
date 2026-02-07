/**
 * Mock data for UI-only development.
 * No API calls — all state is in React.
 */

export type Unit = "PCS" | "KG" | "LITER" | "GALLON";

export interface Product {
  id: string;
  name: string;
  unit: Unit;
  costPrice: number;
  salePrice: number;
  minStock: number;
  barcode: string | null;
  isActive: boolean;
}

export interface InventoryItem {
  productId: string;
  productName: string;
  unit: Unit;
  currentStock: number;
  minStock: number;
}

export const UNITS: Unit[] = ["PCS", "KG", "LITER", "GALLON"];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Emulsion Paint White 4L",
    unit: "LITER",
    costPrice: 450,
    salePrice: 620,
    minStock: 10,
    barcode: "8901234567890",
    isActive: true,
  },
  {
    id: "2",
    name: "Brush 2 inch",
    unit: "PCS",
    costPrice: 85,
    salePrice: 120,
    minStock: 25,
    barcode: null,
    isActive: true,
  },
  {
    id: "3",
    name: "Turpentine 1L",
    unit: "LITER",
    costPrice: 180,
    salePrice: 240,
    minStock: 20,
    barcode: "8901234567891",
    isActive: true,
  },
  {
    id: "4",
    name: "Nails 1 kg Pack",
    unit: "KG",
    costPrice: 120,
    salePrice: 165,
    minStock: 15,
    barcode: null,
    isActive: true,
  },
  {
    id: "5",
    name: "Primer 5L",
    unit: "LITER",
    costPrice: 680,
    salePrice: 899,
    minStock: 8,
    barcode: "8901234567892",
    isActive: true,
  },
  {
    id: "6",
    name: "Putty 5 kg",
    unit: "KG",
    costPrice: 220,
    salePrice: 310,
    minStock: 12,
    barcode: null,
    isActive: false,
  },
];

export const MOCK_INVENTORY: InventoryItem[] = MOCK_PRODUCTS.map((p) => ({
  productId: p.id,
  productName: p.name,
  unit: p.unit,
  currentStock: p.id === "2" ? 3 : p.id === "6" ? 2 : 18,
  minStock: p.minStock,
}));
