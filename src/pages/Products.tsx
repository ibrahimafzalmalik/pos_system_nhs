import { useState } from "react";
import type { Product, ProductFormData } from "../data/mockData";
import { MOCK_PRODUCTS } from "../data/mockData";
import { ProductModal } from "../components/ProductModal";

export function Products() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [modalOpen, setModalOpen] = useState(false);

  function handleSave(data: ProductFormData) {
    const newProduct: Product = {
      id: String(Date.now()),
      name: data.name,
      unit: data.unit,
      costPrice: parseFloat(data.costPrice) || 0,
      salePrice: parseFloat(data.salePrice) || 0,
      minStock: parseFloat(data.minStock) || 0,
      barcode: data.barcode.trim() || null,
      isActive: true,
    };
    setProducts((prev) => [...prev, newProduct]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Products</h1>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Add Product
        </button>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Products">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-medium text-slate-700">Name</th>
                <th className="px-4 py-3 font-medium text-slate-700">Unit</th>
                <th className="px-4 py-3 font-medium text-slate-700">Cost</th>
                <th className="px-4 py-3 font-medium text-slate-700">Price</th>
                <th className="px-4 py-3 font-medium text-slate-700">Status</th>
                <th className="w-24 px-4 py-3 font-medium text-slate-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                >
                  <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-4 py-3 text-slate-600">{p.unit}</td>
                  <td className="px-4 py-3 text-slate-600">{p.costPrice.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{p.salePrice.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.isActive ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      className="text-amber-600 hover:text-amber-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                      aria-label={`Edit ${p.name}`}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
