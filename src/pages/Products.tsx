import { useCallback, useEffect, useState } from "react";
import type { Product } from "../../shared/product";
import { ProductModal } from "../components/ProductModal";
import type { ProductFormData } from "../components/ProductModal";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debouncedValue;
}

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const searchDebounced = useDebounce(searchInput, 300);

  const fetchProducts = useCallback(async (q: string, status: "ACTIVE" | "INACTIVE" | "ALL" = "ACTIVE") => {
    setError(null);
    setLoading(true);
    const result = await window.api.products.list({ q: q.trim() || undefined, status });
    setLoading(false);
    if (result.ok) setProducts(result.data);
    else setError(result.error.message);
  }, []);

  useEffect(() => {
    fetchProducts(searchDebounced, "ACTIVE");
  }, [searchDebounced, fetchProducts]);

  function openAddModal() {
    setEditingProduct(null);
    setModalOpen(true);
    setError(null);
  }

  function openEditModal(p: Product) {
    setEditingProduct(p);
    setModalOpen(true);
    setError(null);
  }

  async function handleSave(data: ProductFormData) {
    setError(null);
    if (editingProduct) {
      const result = await window.api.products.update({
        id: editingProduct.id,
        name: data.name,
        sku: data.sku?.trim() || undefined,
        barcode: data.barcode?.trim() || undefined,
        unit: data.unit,
        costPrice: parseFloat(data.costPrice) || 0,
        salePrice: parseFloat(data.salePrice) || 0,
        minStock: parseFloat(data.minStock) || 0,
        status: data.status ?? editingProduct.status,
      });
      if (result.ok) {
        setModalOpen(false);
        setEditingProduct(null);
        await fetchProducts(searchDebounced, "ACTIVE");
      } else {
        setError(result.error.message);
      }
    } else {
      const result = await window.api.products.create({
        name: data.name,
        sku: data.sku?.trim() || undefined,
        barcode: data.barcode?.trim() || undefined,
        unit: data.unit,
        costPrice: parseFloat(data.costPrice) || 0,
        salePrice: parseFloat(data.salePrice) || 0,
        minStock: parseFloat(data.minStock) || 0,
        status: data.status ?? "ACTIVE",
      });
      if (result.ok) {
        setModalOpen(false);
        await fetchProducts(searchDebounced, "ACTIVE");
      } else {
        setError(result.error.message);
      }
    }
  }

  async function handleToggleStatus(p: Product) {
    const newStatus = p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setError(null);
    const result = await window.api.products.setStatus(p.id, newStatus);
    if (result.ok) await fetchProducts(searchDebounced, "ACTIVE");
    else setError(result.error.message);
  }

  function handleCloseModal() {
    setModalOpen(false);
    setEditingProduct(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-slate-800">Products</h1>
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-amber-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
        >
          Add Product
        </button>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="search"
          placeholder="Search by name, SKU, or barcode..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="flex-1 max-w-md rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
          aria-label="Search products"
        />
      </div>

      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      )}

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
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Loading…
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{p.name}</td>
                    <td className="px-4 py-3 text-slate-600">{p.unit}</td>
                    <td className="px-4 py-3 text-slate-600">{p.costPrice.toFixed(2)}</td>
                    <td className="px-4 py-3 text-slate-600">{p.salePrice.toFixed(2)}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(p)}
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-1 ${
                          p.status === "ACTIVE"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-slate-200 text-slate-600 hover:bg-slate-300"
                        }`}
                        aria-label={p.status === "ACTIVE" ? "Set inactive" : "Set active"}
                        title={p.status === "ACTIVE" ? "Click to set Inactive" : "Click to set Active"}
                      >
                        {p.status === "ACTIVE" ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => openEditModal(p)}
                        className="text-amber-600 hover:text-amber-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 rounded"
                        aria-label={`Edit ${p.name}`}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSave={handleSave}
        initialProduct={editingProduct}
      />
    </div>
  );
}
