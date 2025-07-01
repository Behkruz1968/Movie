// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import {
  HomeOutlined,
  VideoCameraOutlined,
  SearchOutlined,
  GithubOutlined,
  InstagramOutlined,
  YoutubeOutlined,
  SendOutlined,
} from "@ant-design/icons";
import logo from "../assets/main-logo.svg";

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 dark:bg-zinc-900 text-zinc-300 dark:text-zinc-400 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        
        {/* Logo & Description */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logo} alt="KinoWeb" className="w-30 h-30" />
         
          </div>
          <p className="leading-relaxed">
            Eng so‘nggi filmlar va aktyorlar haqidagi ma’lumotlar. Qidiruv, treyler va baholash — barchasi bizda.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4">Sahifalar</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/" className="flex items-center gap-2 hover:text-white">
                <HomeOutlined /> Bosh sahifa
              </Link>
            </li>
            <li>
              <Link to="/movies" className="flex items-center gap-2 hover:text-white">
                <VideoCameraOutlined /> Kinolar
              </Link>
            </li>
            <li>
              <Link to="/search" className="flex items-center gap-2 hover:text-white">
                <SearchOutlined /> Qidiruv
              </Link>
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Havolalar</h3>
          <ul className="space-y-2">
            <li>
              <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" className="hover:text-white">
                TMDB API
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">Maxfiylik siyosati</a>
            </li>
            <li>
              <a href="#" className="hover:text-white">Foydalanish shartlari</a>
            </li>
          </ul>
        </div>

        {/* Socials */}
        <div>
          <h3 className="text-white font-semibold mb-4">Ijtimoiy tarmoqlar</h3>
          <div className="flex gap-5 text-xl">
            <a href="https://t.me/kinoweb" target="_blank" rel="noreferrer" className="hover:text-sky-400">
              <SendOutlined />
            </a>
            <a href="https://instagram.com/kinoweb" target="_blank" rel="noreferrer" className="hover:text-pink-500">
              <InstagramOutlined />
            </a>
            <a href="https://youtube.com/kinoweb" target="_blank" rel="noreferrer" className="hover:text-red-600">
              <YoutubeOutlined />
            </a>
            <a href="https://github.com/kinoweb" target="_blank" rel="noreferrer" className="hover:text-gray-400">
              <GithubOutlined />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom copyright */}
      <div className="text-center text-xs py-4 border-t border-zinc-800 text-zinc-500 dark:text-zinc-600">
        © {new Date().getFullYear()} KinoWeb. Barcha huquqlar himoyalangan.
      </div>
    </footer>
  );
};

export default Footer;
