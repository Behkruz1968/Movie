import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  DesktopOutlined,
  VideoCameraOutlined,
  BookOutlined,
  SearchOutlined,
  UserOutlined,
  BulbOutlined,
  MenuOutlined,
} from "@ant-design/icons";
import { Drawer } from "antd";
import logo from "../assets/main-logo.svg";

interface IUser {
  name: string;
  email: string;
}

const Header = () => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();

  const handleTheme = () => {
    const isDark = document.body.classList.toggle("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark");
    } else {
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
    { to: "/", label: "Главный", icon: <DesktopOutlined /> },
    { to: "/movies", label: "Фильмы", icon: <VideoCameraOutlined /> },
    { to: "/saved", label: "Сохранней", icon: <BookOutlined /> },
    { to: "/search", label: "Поиск", icon: <SearchOutlined /> },
  ];

  const linkStyle = "flex flex-col items-center gap-0.5 text-sm";
  const active = "text-red-600";
  const inactive = "text-gray-400 hover:text-dark dark:hover:text-white";

  return (
    <header className="bg-white dark:bg-black text-black dark:text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 py-3 flex justify-between items-center">
        <div
          className="flex items-center gap-2 text-red-600 font-bold text-lg tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="logo" className="w-28 h-auto object-contain" />
        </div>

        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `${linkStyle} ${isActive ? active : inactive}`
              }
            >
              <span className="text-lg">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={handleTheme}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-700 dark:hover:text-white"
          >
            <BulbOutlined />
            <span>Режим</span>
          </button>

          {user ? (
            <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
              <UserOutlined className="text-red-600" />
              <span>Привет, <b>{user.name}</b></span>
              <button
                onClick={handleLogout}
                className="ml-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Выйти
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `flex items-center gap-1 text-sm ${isActive ? active : inactive}`
              }
            >
              <UserOutlined />
              <span>Войти</span>
            </NavLink>
          )}
        </div>

        <button
          className="md:hidden text-xl text-gray-500 dark:text-white"
          onClick={() => setOpen(true)}
        >
          <MenuOutlined />
        </button>
      </div>

      <Drawer
        title={
          <div
            className="flex items-center gap-2 text-red-600 font-bold text-lg cursor-pointer"
            onClick={() => {
              navigate("/");
              setOpen(false);
            }}
          >
            <img src={logo} alt="logo" className="w-24 h-auto object-contain" />
          </div>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        styles={{ body: { padding: "1rem" } }}
      >
        <nav className="flex flex-col gap-6">
          {navItems.map(({ to, icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-600 dark:text-white hover:text-red-500 text-base"
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          ))}

          <button
            onClick={() => {
              handleTheme();
              setOpen(false);
            }}
            className="flex items-center gap-3 text-gray-600 dark:text-white hover:text-red-500 text-base"
          >
            <BulbOutlined />
            <span>Режим</span>
          </button>

          {user ? (
            <div className="flex flex-col gap-3 text-gray-600 dark:text-white">
              <div className="flex items-center gap-3">
                <UserOutlined />
                <span>Привет, <b>{user.name}</b></span>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
              >
                Выйти
              </button>
            </div>
          ) : (
            <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-600 dark:text-white hover:text-red-500 text-base"
            >
              <UserOutlined />
              <span>Войти</span>
            </NavLink>
          )}
        </nav>
      </Drawer>
    </header>
  );
};

export default Header;
