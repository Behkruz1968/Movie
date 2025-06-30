import { useState } from "react";
import { NavLink } from "react-router-dom";
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

const Header = () => {
  const [open, setOpen] = useState(false);

  const handleTheme = () => {
    document.body.classList.toggle("dark");
  };

  const linkBaseStyle =
    "flex flex-col items-center gap-0.5 transition-all duration-200 text-sm";
  const inactiveStyle = "text-gray-400 hover:text-dark dark:hover:text-white";
  const activeStyle = "text-red-600";

  const navItems = [
    {
      to: "/",
      label: "Главный",
      icon: <DesktopOutlined className="text-lg" />,
    },
    {
      to: "/movies",
      label: "Фильмы",
      icon: <VideoCameraOutlined className="text-lg" />,
    },
    {
      to: "/saved",
      label: "Сохранней",
      icon: <BookOutlined className="text-lg" />,
    },
    {
      to: "/search",
      label: "Поиск",
      icon: <SearchOutlined className="text-lg" />,
    },
  ];

  return (
    <header className="bg-white text-black dark:bg-black dark:text-white shadow-sm sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 text-red-600 font-bold text-lg tracking-wide">
          <img src={logo} alt="logo" className="w-28 h-auto object-contain" />
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${linkBaseStyle} ${
                  isActive ? activeStyle : inactiveStyle
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-4">
          {/* Dark mode */}
          <button
            onClick={handleTheme}
            className="flex items-center gap-1 text-gray-400 hover:text-red-700 dark:hover:text-white transition-all duration-200 text-sm"
          >
            <BulbOutlined />
            <span>Режим</span>
          </button>

          {/* Profile */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-1 text-sm transition-all duration-200 ${
                isActive ? activeStyle : inactiveStyle
              }`
            }
          >
            <UserOutlined />
            <span>Профиль</span>
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-xl text-gray-500 dark:text-white"
          onClick={() => setOpen(true)}
        >
          <MenuOutlined />
        </button>
      </div>

      {/* Drawer (Mobile Nav) */}
      <Drawer
        title={
          <div className="flex items-center gap-2 text-red-600 font-bold text-lg">
            <img src={logo} alt="logo" className="w-24 h-auto object-contain" />
          </div>
        }
        placement="right"
        onClose={() => setOpen(false)}
        open={open}
        bodyStyle={{ padding: "1rem" }}
      >
        <div className="flex flex-col gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 text-gray-600 dark:text-white hover:text-red-500 text-base"
            >
              {item.icon}
              <span>{item.label}</span>
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

          <NavLink
            to="/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-gray-600 dark:text-white hover:text-red-500 text-base"
          >
            <UserOutlined />
            <span>Профиль</span>
          </NavLink>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
