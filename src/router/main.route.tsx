import { Navigate } from "react-router-dom";
import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/UserList";
import OrderList from "../pages/OrderList";
import CartList from "../pages/CartList";
import CategoryList from "../pages/CategoryList";
import BrandList from "../pages/BrandList";
import AdminLogin from "../pages/AdminLogin";
import AdminRegister from "../pages/AdminRegister";
import ReturnRequestList from "../pages/ReturnRequestList";

import ProtectedRoute from "../components/auth/ProtectedRoute";

// Import từ modules
import { 
  ProductList, 
  ProductCreate,
  ProductEdit,
  AttributeList
} from "../modules/products";

const routes = [
  // Public routes
  {
    path: "/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/login",
    element: <AdminLogin />,
  },
  {
    path: "/admin/register", 
    element: <AdminRegister />,
  },
  
  // Admin routes (cần admin role)
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      
      // Quản lý sản phẩm
      { path: "products", element: <ProductList /> },
      { path: "products/create", element: <ProductCreate /> },
      { path: "products/edit/:id", element: <ProductEdit /> },

      { path: "categories", element: <CategoryList /> },
      { path: "brands", element: <BrandList /> },
      { path: "attributes", element: <AttributeList /> },
      

      

      // Quản lý người dùng
      { path: "users", element: <UserList /> },
      
      // Quản lý đơn hàng
      { path: "orders", element: <OrderList /> },
      
      // Quản lý giỏ hàng
      { path: "carts", element: <CartList /> },
      
      // Quản lý hoàn hàng
      { path: "return-requests", element: <ReturnRequestList /> },
    ],
  },
  
  // Client routes (chỉ cần đăng nhập)
  {
    path: "/client",
    element: (
      <ProtectedRoute>
        <div>Client Dashboard</div>
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <div>Client Dashboard</div> },
    ],
  },
  
  // Redirect root to admin
  {
    path: "/",
    element: <Navigate to="/admin" />,
  },
  
  // Catch all
  {
    path: "*",
    element: <Navigate to="/admin/login" />,
  },
];

export default routes;