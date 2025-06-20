import { Navigate } from "react-router-dom";
import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/UserList";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import ProtectedRoute from "../components/auth/ProtectedRoute";

// Import từ modules
import { OrderList } from "../modules/orders";
import { 
  ProductList, 
  CategoryList, 
  BrandList,
  ProductCreate,
  ProductEdit,
  AttributeList
} from "../modules/products";

const routes = [
  // Public routes
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register", 
    element: <Register />,
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
      
      // Quản lý đơn hàng
      { path: "orders", element: <OrderList /> },
      
      // Quản lý người dùng
      { path: "users", element: <UserList /> },
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
  
  // Redirect root to login
  {
    path: "/",
    element: <Navigate to="/login" />,
  },
  
  // Catch all
  {
    path: "*",
    element: <Navigate to="/login" />,
  },
];

export default routes;