import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  VideoCameraOutlined,
  BookOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";

interface IUser {
  name: string;
  email: string;
}

const BottomNav: React.FC = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    else setUser(null);
  }, []);

  const items = [
    { to: "/", icon: <HomeOutlined />, label: "Home" },
    { to: "/movies", icon: <VideoCameraOutlined />, label: "Movies" },
    { to: "/saved", icon: <BookOutlined />, label: "Saved" },
    { to: "/search", icon: <SearchOutlined />, label: "Search" },
    { to: "/profile", icon: <UserOutlined />, label: "Profile" },
  ];

  const handleClick = (path: string) => {
    if (path === "/profile") {
      if (user) navigate("/profile");
      else navigate("/login");
    } else {
      navigate(path);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-black border-t border-gray-300 dark:border-gray-700 md:hidden">
      <ul className="flex justify-around items-center h-14">
        {items.map(({ to, icon, label }) => {
          const isActive = location.pathname === to;
          return (
            <li key={to}>
              <button
                onClick={() => handleClick(to)}
                className={`flex flex-col items-center justify-center text-xs w-full ${
                  isActive
                    ? "text-red-600"
                    : "text-gray-500 dark:text-gray-300"
                }`}
              >
                <span className="text-xl">{icon}</span>
                <span>{label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNav;
