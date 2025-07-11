import BottomNav from "@/layout/BottomNav";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <BottomNav/>
      <Footer />
    </>
  );
};

export default React.memo(Layout);
