import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

// Layouts
import AdminLayout from "../layouts/AdminLayout";
import UserLayout from "../layouts/UserLayout";

// Pages
import Login from "../pages/Login";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UsersManagement from "../pages/admin/UsersManagement";
import CategoriesManagement from "../pages/admin/CategoriesManagement";
import UnitsManagement from "../pages/admin/UnitsManagement";
import PresentationsManagement from "../pages/admin/PresentationsManagement";
import NotFound from "../pages/NotFound";
import ProductsManagement from "../pages/admin/ProductsManagement";
import ProductDetails from "../pages/admin/ProductDetails";
import ClientsManagement from "../pages/admin/ClientsManagement";
import ClientDetails from "../pages/admin/ClientDetails";

//pages de usuarios
import UserDashboard from "../pages/user/UserDashboard";
import UserBranches from "../pages/user/UserBranches";
import UserOrders from "../pages/user/UserOrders";
import UserProfile from "../pages/user/UserProfile";
import OrderDetail from "../pages/user/OrderDetail";
import NewOrder from "../pages/user/NewOrder";

function AppRouter() {
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {!auth ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : auth.user.rol === 'admin' ? (
          <Route path="/" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/admin/categories" element={<CategoriesManagement />} />
            <Route path="/admin/units" element={<UnitsManagement />} />
            <Route path="/admin/presentations" element={<PresentationsManagement />} />
            <Route path="/admin/products" element={<ProductsManagement />} />
            <Route path="/admin/products/:id/details" element={<ProductDetails />} />
            <Route path="/admin/clients" element={<ClientsManagement />} />
            <Route path="/admin/clients/:id/details" element={<ClientDetails />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        ) : (
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Navigate to="/user/dashboard" />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/branches" element={<UserBranches />} />
            <Route path="/user/orders" element={<UserOrders />} />
            <Route path="/user/orders/new" element={<NewOrder />} />
            <Route path="/user/orders/:id" element={<OrderDetail />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;