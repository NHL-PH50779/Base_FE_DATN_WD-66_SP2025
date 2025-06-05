import React from "react";
import { useRoutes } from "react-router-dom";
import ClientLayout from "./components/layouts/ClientLayout";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import AdminLayout from "./components/layouts/AdminLayout";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PasswordReset from "./pages/PasswordReset";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import About from "./pages/About"; 
import Contact from "./pages/Contact"; 
// import ProductDetail from "./pages/ProductDetail"; // Thêm
import Orders from "./pages/Order";
import News from "./pages/News";


const routeConfig = [
  {
    path: "/",
    element: <ClientLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/product/:id",
        // element: <ProductDetail />,
      },
      {
        path: "about",
        element: <About />, // Thêm tuyến đường cho About
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/shop",
        element: <Shop />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/forgot-password",
        element: <PasswordReset />,
      },
      {
        path: "/cart",
        element: <Cart />,
      },
      {
        path: "/contact",
        element: <Contact />,
         // Thêm tuyến đường cho Contact
      },
      { path: "/orders", element: <Orders /> },
     { path: "/news", element: <News /> },

    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        // element: <List />,
      },
      {
        path: "product/list",
        // element: <List />,
      },
      {
        path: "product/add",
        // element: <Add />,
      },
      {
        path: "product/edit/:id",
        // element: <Edit />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <>
        <Header />
        {/* <NotFound /> */}
        <Footer />
      </>
    ),
  },
];

function App() {
  const routes = useRoutes(routeConfig);
  return <main>{routes}</main>;
}

export default App;