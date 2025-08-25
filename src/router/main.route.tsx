import { Navigate } from "react-router-dom";
import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import UserList from "../pages/UserList";
import OrderList from "../pages/OrderList";

import CategoryList from "../pages/CategoryList";
import CategoryDetail from "../pages/CategoryDetail";
import BrandList from "../pages/BrandList";
import BrandDetail from "../pages/BrandDetail";
import AdminLogin from "../pages/AdminLogin";
import AdminRegister from "../pages/AdminRegister";
import ReturnRequestList from "../pages/ReturnRequestList";
import CommentManagement from "../pages/CommentManagement";
import ReviewManagement from "../pages/ReviewManagement";
import VoucherManagement from "../pages/VoucherManagement";
import ProductDetail from "../pages/ProductDetail";
// FlashSaleManagement removed
import TrashedProducts from "../pages/TrashedProducts";
import AdminProfile from "../pages/AdminProfile";
import WithdrawRequestManagement from "../pages/WithdrawRequestManagement";
import ChatAdmin from "../pages/ChatAdmin";

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
      { path: "products/detail/:id", element: <ProductDetail /> },
      { path: "products/trashed", element: <TrashedProducts /> },

      { path: "categories", element: <CategoryList /> },
      { path: "categories/:id", element: <CategoryDetail /> },
      { path: "brands", element: <BrandList /> },
      { path: "brands/:id", element: <BrandDetail /> },
      { path: "attributes", element: <AttributeList /> },
      

      

      // Quản lý người dùng
      { path: "users", element: <UserList /> },
      
      // Quản lý đơn hàng
      { path: "orders", element: <OrderList /> },
      

      
      // Quản lý hoàn hàng và rút tiền
      { path: "return-requests", element: <ReturnRequestList /> },
      { path: "withdraw-requests", element: <WithdrawRequestManagement /> },
      { path: "chat", element: <ChatAdmin /> },
      
      // Quản lý bình luận và đánh giá
      { path: "comments", element: <CommentManagement /> },
      { path: "reviews", element: <ReviewManagement /> },
      
      // Quản lý voucher
      { path: "vouchers", element: <VoucherManagement /> },
      
      // Flash Sale management removed
      
      // Thông tin tài khoản
      { path: "profile", element: <AdminProfile /> },
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