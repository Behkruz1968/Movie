import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { DesktopOutlined, VideoCameraOutlined, BookOutlined, SearchOutlined, UserOutlined, BulbOutlined, MenuOutlined, } from "@ant-design/icons";
import { Drawer } from "antd";
import logo from "../assets/main-logo.svg";
const Header = () => {
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const handleTheme = () => {
        const isDark = document.body.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    };
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") {
            document.body.classList.add("dark");
        }
        else {
            document.body.classList.remove("dark");
        }
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);
    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        navigate("/login");
        setOpen(false);
    };
    const navItems = [
        { to: "/", label: "Главный", icon: _jsx(DesktopOutlined, {}) },
        { to: "/movies", label: "Фильмы", icon: _jsx(VideoCameraOutlined, {}) },
        { to: "/saved", label: "Сохранней", icon: _jsx(BookOutlined, {}) },
        { to: "/search", label: "Поиск", icon: _jsx(SearchOutlined, {}) },
    ];
    const linkStyle = "flex flex-col items-center gap-0.5 text-sm";
    const active = "text-red-600";
    const inactive = "text-gray-400 hover:text-dark dark:hover:text-white";
    return (_jsxs("header", { className: "bg-white dark:bg-black text-black dark:text-white shadow-sm sticky top-0 z-50", children: [_jsxs("div", { className: "max-w-[1280px] mx-auto px-4 py-3 flex justify-between items-center", children: [_jsx("div", { className: "flex items-center gap-2 text-red-600 font-bold text-lg tracking-wide cursor-pointer", onClick: () => navigate("/"), children: _jsx("img", { src: logo, alt: "logo", className: "w-28 h-auto object-contain" }) }), _jsx("nav", { className: "hidden md:flex gap-8 items-center", children: navItems.map(({ to, icon, label }) => (_jsxs(NavLink, { to: to, className: ({ isActive }) => `${linkStyle} ${isActive ? active : inactive}`, children: [_jsx("span", { className: "text-lg", children: icon }), _jsx("span", { children: label })] }, to))) }), _jsxs("div", { className: "hidden md:flex items-center gap-4", children: [_jsxs("button", { onClick: handleTheme, className: "flex items-center gap-1 text-sm text-gray-400 hover:text-red-700 dark:hover:text-white", children: [_jsx(BulbOutlined, {}), _jsx("span", { children: "\u0420\u0435\u0436\u0438\u043C" })] }), user ? (_jsxs("div", { className: "flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300", children: [_jsx(UserOutlined, { className: "text-red-600" }), _jsxs("span", { children: ["\u041F\u0440\u0438\u0432\u0435\u0442, ", _jsx("b", { children: user.name })] }), _jsx("button", { onClick: handleLogout, className: "ml-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700", children: "\u0412\u044B\u0439\u0442\u0438" })] })) : (_jsxs(NavLink, { to: "/login", className: ({ isActive }) => `flex items-center gap-1 text-sm ${isActive ? active : inactive}`, children: [_jsx(UserOutlined, {}), _jsx("span", { children: "\u0412\u043E\u0439\u0442\u0438" })] }))] }), _jsx("button", { className: "md:hidden text-xl text-gray-500 dark:text-white", onClick: () => setOpen(true), children: _jsx(MenuOutlined, {}) })] }), _jsx(Drawer, { title: _jsx("div", { className: "flex items-center gap-2 text-red-600 font-bold text-lg cursor-pointer", onClick: () => {
                        navigate("/");
                        setOpen(false);
                    }, children: _jsx("img", { src: logo, alt: "logo", className: "w-24 h-auto object-contain" }) }), placement: "right", onClose: () => setOpen(false), open: open, styles: { body: { padding: "1rem" } }, children: _jsxs("nav", { className: "flex flex-col gap-6", children: [navItems.map(({ to, icon, label }) => (_jsxs(NavLink, { to: to, onClick: () => setOpen(false), className: "flex items-center gap-3 text-gray-600 dark:text-white hover:text-red-500 text-base", children: [icon, _jsx("span", { children: label })] }, to))), _jsxs("button", { onClick: () => {
                                handleTheme();
                                setOpen(false);
                            }, className: "flex items-center gap-3 text-gray-600 dark:text-white hover:text-red-500 text-base", children: [_jsx(BulbOutlined, {}), _jsx("span", { children: "\u0420\u0435\u0436\u0438\u043C" })] }), user ? (_jsxs("div", { className: "flex flex-col gap-3 text-gray-600 dark:text-white", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx(UserOutlined, {}), _jsxs("span", { children: ["\u041F\u0440\u0438\u0432\u0435\u0442, ", _jsx("b", { children: user.name })] })] }), _jsx("button", { onClick: handleLogout, className: "bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700", children: "\u0412\u044B\u0439\u0442\u0438" })] })) : (_jsxs(NavLink, { to: "/login", onClick: () => setOpen(false), className: "flex items-center gap-3 text-gray-600 dark:text-white hover:text-red-500 text-base", children: [_jsx(UserOutlined, {}), _jsx("span", { children: "\u0412\u043E\u0439\u0442\u0438" })] }))] }) })] }));
};
export default Header;
