import { Navigate } from "react-router-dom";
import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/UserList";

// Import từ modules
import { OrderList } from "../modules/orders";
import { 
  ProductList, 
  CategoryList, 
  BrandList,
  ProductCreate,
  ProductEdit
} from "../modules/products";

const routes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      
      // Quản lý sản phẩm
      { path: "products", element: <ProductList /> },
      { path: "products/create", element: <ProductCreate /> },
      { path: "products/edit/:id", element: <ProductEdit /> },
      { path: "categories", element: <CategoryList /> },
      { path: "brands", element: <BrandList /> },
      
      // Quản lý đơn hàng
      { path: "orders", element: <OrderList /> },
      
      // Quản lý người dùng
      { path: "users", element: <UserList /> },
    ],
  },
  
  // Redirect root to admin dashboard
  {
    path: "/",
    element: <Navigate to="/admin/dashboard" />,
  },
  
  // Catch all - redirect to admin dashboard
  {
    path: "*",
    element: <Navigate to="/admin/dashboard" />,
  },
];

export default routes;