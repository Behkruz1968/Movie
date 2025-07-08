import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { HomeOutlined, VideoCameraOutlined, BookOutlined, SearchOutlined, UserOutlined, } from "@ant-design/icons";
const BottomNav = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        else {
            setUser(null);
        }
    }, []);
    const items = [
        { to: "/", icon: _jsx(HomeOutlined, {}), label: "Home" },
        { to: "/movies", icon: _jsx(VideoCameraOutlined, {}), label: "Movies" },
        { to: "/saved", icon: _jsx(BookOutlined, {}), label: "Saved" },
        { to: "/search", icon: _jsx(SearchOutlined, {}), label: "Search" },
        { to: "/profile", icon: _jsx(UserOutlined, {}), label: "Profile" },
    ];
    const handleClick = (path) => {
        if (path === "/profile") {
            if (user) {
                navigate("/profile");
            }
            else {
                navigate("/login");
            }
        }
        else {
            navigate(path);
        }
    };
    return (_jsx("nav", { className: "fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 md:hidden", children: _jsx("ul", { className: "flex justify-around items-center h-14", children: items.map(({ to, icon, label }) => {
                const isActive = location.pathname === to;
                return (_jsx("li", { children: _jsxs("button", { onClick: () => handleClick(to), className: `flex flex-col items-center justify-center text-xs w-full ${isActive ? "text-red-600" : "text-gray-500 dark:text-gray-300"}`, children: [_jsx("span", { className: "text-xl", children: icon }), _jsx("span", { children: label })] }) }, to));
            }) }) }));
};
export default BottomNav;
