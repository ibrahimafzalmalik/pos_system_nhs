import type { InventoryItem } from "../data/mockData";
import { MOCK_INVENTORY } from "../data/mockData";

function isLowStock(item: InventoryItem): boolean {
  return item.currentStock <= item.minStock;
}

export function Inventory() {
  const items: InventoryItem[] = MOCK_INVENTORY;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">Inventory</h1>

      <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm" aria-label="Inventory">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-medium text-slate-700">Product</th>
                <th className="px-4 py-3 font-medium text-slate-700">Unit</th>
                <th className="px-4 py-3 font-medium text-slate-700">Current Stock</th>
                <th className="px-4 py-3 font-medium text-slate-700">Min Stock</th>
                <th className="px-4 py-3 font-medium text-slate-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const low = isLowStock(item);
                return (
                  <tr
                    key={item.productId}
                    className={`border-b border-slate-100 last:border-0 ${
                      low ? "bg-red-50/80" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">{item.productName}</td>
                    <td className="px-4 py-3 text-slate-600">{item.unit}</td>
                    <td className={`px-4 py-3 font-medium ${low ? "text-red-700" : "text-slate-700"}`}>
                      {item.currentStock}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{item.minStock}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          low ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {low ? "Low stock" : "OK"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
