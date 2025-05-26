import { Navigate } from "react-router-dom";
import LaptopList from "../pages/LaptopList";
import AdminLayout from "../components/layouts/AdminLayout";
import Dashboard from "../pages/Dashboard"; // THÊM

const routes = [
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: "dashboard", element: <Dashboard /> }, // THÊM
      { path: "laptops", element: <LaptopList /> },
    ],
  },
];

export default routes;
