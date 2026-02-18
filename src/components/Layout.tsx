import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/invoice/create', label: 'Create Invoice' },
  { to: '/invoices', label: 'Invoices' },
  { to: '/customers', label: 'Customers' },
  { to: '/items', label: 'Items' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings/store-profile', label: 'Store' },
];

export default function Layout(): JSX.Element {
  const location = useLocation();
  const signOut = useAuthStore((state) => state.signOut);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
          <h1 className="text-base font-bold text-brand-600 md:text-xl">GST Kirana Store</h1>
          <button className="bg-gray-200 hover:bg-gray-300" onClick={() => void signOut()}>
            Logout
          </button>
        </div>
        <nav className="overflow-x-auto px-2 pb-2">
          <ul className="mx-auto flex max-w-7xl gap-2">
            {links.map((link) => (
              <li key={link.to}>
                <Link
                  className={`block whitespace-nowrap rounded-lg px-3 py-2 text-sm ${
                    location.pathname === link.to ? 'bg-brand-600 text-white' : 'bg-gray-200'
                  }`}
                  to={link.to}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
