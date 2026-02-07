export function POS() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-slate-800">POS</h1>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="lg:col-span-2 space-y-4">
          <label htmlFor="pos-search" className="sr-only">
            Search products
          </label>
          <input
            id="pos-search"
            type="search"
            placeholder="Search products..."
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-slate-800 placeholder-slate-500 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            autoComplete="off"
            aria-label="Search products"
          />

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm" aria-label="Cart">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-medium text-slate-700">Product</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Qty</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Price</th>
                  <th className="px-4 py-3 font-medium text-slate-700">Total</th>
                  <th className="w-12 px-4 py-3" aria-hidden />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-slate-500">
                    Cart is empty
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <h2 className="text-sm font-semibold text-slate-700">Totals</h2>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-600">Subtotal</dt>
                <dd className="font-medium text-slate-800">—</dd>
              </div>
              <div className="flex justify-between border-t border-slate-100 pt-2">
                <dt className="text-slate-600">Total</dt>
                <dd className="font-semibold text-slate-900">—</dd>
              </div>
            </dl>
            <button
              type="button"
              disabled
              className="w-full rounded-lg bg-slate-300 px-4 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed"
              aria-disabled="true"
            >
              Complete Sale
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
