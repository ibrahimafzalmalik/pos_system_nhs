import { useEffect, useRef } from "react";
import type { Product, Unit } from "../../shared/product";
import { Unit as UnitList } from "../../shared/product";

export interface ProductFormData {
  name: string;
  sku: string;
  unit: Unit;
  costPrice: string;
  salePrice: string;
  minStock: string;
  barcode: string;
  status?: "ACTIVE" | "INACTIVE";
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductFormData) => void;
  initialProduct?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSave, initialProduct }: ProductModalProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      firstInputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      return () => window.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isEdit = initialProduct != null;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    onSave({
      name: (fd.get("name") as string) || "",
      sku: (fd.get("sku") as string) || "",
      unit: (fd.get("unit") as Unit) || "PCS",
      costPrice: (fd.get("costPrice") as string) || "",
      salePrice: (fd.get("salePrice") as string) || "",
      minStock: (fd.get("minStock") as string) || "",
      barcode: (fd.get("barcode") as string) || "",
      ...(isEdit && { status: (fd.get("status") as "ACTIVE" | "INACTIVE") || initialProduct?.status }),
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-xl"
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <div className="border-b border-slate-200 px-6 py-4">
          <h2 id="product-modal-title" className="text-lg font-semibold text-slate-800">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>
        </div>
        <form
          key={initialProduct?.id ?? "new"}
          ref={formRef}
          onSubmit={handleSubmit}
          className="p-6 space-y-4"
        >
          <div>
            <label htmlFor="product-name" className="mb-1 block text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              ref={firstInputRef}
              id="product-name"
              name="name"
              type="text"
              required
              defaultValue={initialProduct?.name ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="Product name"
            />
          </div>
          <div>
            <label htmlFor="product-sku" className="mb-1 block text-sm font-medium text-slate-700">
              SKU <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="product-sku"
              name="sku"
              type="text"
              defaultValue={initialProduct?.sku ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="Optional SKU"
            />
          </div>
          <div>
            <label htmlFor="product-unit" className="mb-1 block text-sm font-medium text-slate-700">
              Unit
            </label>
            <select
              id="product-unit"
              name="unit"
              defaultValue={initialProduct?.unit ?? "PCS"}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              {UnitList.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="product-cost" className="mb-1 block text-sm font-medium text-slate-700">
                Cost Price
              </label>
              <input
                id="product-cost"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={initialProduct?.costPrice ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="0.00"
              />
            </div>
            <div>
              <label htmlFor="product-sale" className="mb-1 block text-sm font-medium text-slate-700">
                Sale Price
              </label>
              <input
                id="product-sale"
                name="salePrice"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={initialProduct?.salePrice ?? ""}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label htmlFor="product-minstock" className="mb-1 block text-sm font-medium text-slate-700">
              Min Stock
            </label>
            <input
              id="product-minstock"
              name="minStock"
              type="number"
              step="0.01"
              min="0"
              defaultValue={initialProduct?.minStock ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="0"
            />
          </div>
          <div>
            <label htmlFor="product-barcode" className="mb-1 block text-sm font-medium text-slate-700">
              Barcode <span className="text-slate-500">(optional)</span>
            </label>
            <input
              id="product-barcode"
              name="barcode"
              type="text"
              defaultValue={initialProduct?.barcode ?? ""}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              placeholder="Optional barcode"
            />
          </div>
          {isEdit && (
            <div>
              <label htmlFor="product-status" className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="product-status"
                name="status"
                defaultValue={initialProduct?.status ?? "ACTIVE"}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
