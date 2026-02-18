import { Navigate, type RouteObject } from 'react-router-dom';
import App from '../App';
import Layout from '../components/Layout';
import LoginPage from '../pages/login/page';
import DashboardPage from '../pages/dashboard/page';
import CreateInvoicePage from '../pages/invoice/create/page';
import InvoicesPage from '../pages/invoices/page';
import CustomersPage from '../pages/customers/page';
import ItemsPage from '../pages/items/page';
import ReportsPage from '../pages/reports/page';
import StoreProfilePage from '../pages/settings/store-profile/page';
import { useAuthStore } from '../store/authStore';

function ProtectedRoute(): JSX.Element {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Layout />;
}

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'login', element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'invoice/create', element: <CreateInvoicePage /> },
          { path: 'invoices', element: <InvoicesPage /> },
          { path: 'customers', element: <CustomersPage /> },
          { path: 'items', element: <ItemsPage /> },
          { path: 'reports', element: <ReportsPage /> },
          { path: 'settings/store-profile', element: <StoreProfilePage /> },
        ],
      },
    ],
  },
];
