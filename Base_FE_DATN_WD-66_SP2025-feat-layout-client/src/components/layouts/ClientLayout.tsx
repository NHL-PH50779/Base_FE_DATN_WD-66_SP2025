import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import Banner from "../common/Banner"; // Chỉ nếu bạn đang dùng Banner ở đây

const ClientLayout = () => {
  const location = useLocation();

  // Ẩn Banner nếu đang ở login hoặc register
  const hideBanner =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/cart" ||
      location.pathname === "/news" ;
  return (
    <>
      <Header />

      {/* Chỉ hiển thị Banner nếu không ở trang login/register */}
      {!hideBanner && <Banner />}

      <Outlet />

      <Footer />
    </>
  );
};

export default ClientLayout;
