import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import BottomNav from "@/layout/BottomNav";
import Footer from "@/layout/Footer";
import Header from "@/layout/Header";
import React from "react";
import { Outlet } from "react-router-dom";
const Layout = () => {
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx("main", { children: _jsx(Outlet, {}) }), _jsx(BottomNav, {}), _jsx(Footer, {})] }));
};
export default React.memo(Layout);
