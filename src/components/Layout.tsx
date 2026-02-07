import { Link, NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "POS" },
  { to: "/products", label: "Products" },
  { to: "/inventory", label: "Inventory" },
];

export function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      <aside
        className="flex w-56 flex-col border-r border-slate-200 bg-white shadow-sm"
        aria-label="Main navigation"
      >
        <div className="border-b border-slate-200 px-4 py-5">
          <Link
            to="/"
            className="text-lg font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 rounded"
          >
            Nisar Paint & Hardware Store POS
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 p-3" role="navigation">
          {navItems.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 ${
                  isActive
                    ? "bg-amber-50 text-amber-800"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-800"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6 focus:outline-none" tabIndex={0}>
        <Outlet />
      </main>
    </div>
  );
}
