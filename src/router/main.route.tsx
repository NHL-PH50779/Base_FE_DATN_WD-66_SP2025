import { Navigate, Route } from "react-router-dom";
import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/Dashboard"; // THÊM
import ListLaptop from "../pages/LaptopList";
import CategoryList from "../pages/CategoryList";
import ManufacturerList from "../pages/ManufacturerList";
import OrderList from "../pages/OrderList";
import UserList from "../pages/UserList";
import Variant from "../pages/Variant";

const routes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "laptops", element: <ListLaptop /> }, 
      { path: "categories", element: <CategoryList /> },
      { path: "manufacturers", element: <ManufacturerList /> },
      { path: "orders", element: <OrderList /> },
      { path: "users", element: <UserList /> },
      { path: "variants", element: <Variant /> },
    ],
  },
];


export default routes;
