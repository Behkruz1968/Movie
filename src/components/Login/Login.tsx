import React, { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import logo from "@/assets/main-logo.svg";

interface UserData {
  name: string;
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
  });

  const [users, setUsers] = useState<UserData[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<UserData | null>(null);
  const [emailExists, setEmailExists] = useState(false);

  const checkEmailExists = (email: string) =>
    users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) setUsers(JSON.parse(storedUsers));

    const storedUser = localStorage.getItem("user");
    if (storedUser) setLoggedInUser(JSON.parse(storedUser));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      const foundUser = checkEmailExists(value);
      setEmailExists(!!foundUser);
      if (foundUser) {
        setFormData((prev) => ({ ...prev, name: foundUser.name }));
      } else {
        setFormData((prev) => ({ ...prev, name: "" }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.email || !formData.name || !formData.password) {
      alert("Iltimos, barcha maydonlarni to‘ldiring");
      return;
    }

    if (emailExists) {
      const existingUser = checkEmailExists(formData.email);
      if (
        existingUser &&
        existingUser.name === formData.name &&
        existingUser.password === formData.password
      ) {
        localStorage.setItem("user", JSON.stringify(existingUser));
        setLoggedInUser(existingUser);
        alert("Tizimga muvaffaqiyatli kirdingiz!");
      } else {
        alert("Email avval ro'yxatdan o'tgan, lekin ism yoki parol noto‘g‘ri.");
      }
    } else {
      const newUsers = [...users, formData];
      localStorage.setItem("users", JSON.stringify(newUsers));
      localStorage.setItem("user", JSON.stringify(formData));
      setUsers(newUsers);
      setLoggedInUser(formData);
      alert("Ro'yxatdan o'tish muvaffaqiyatli amalga oshirildi!");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setLoggedInUser(null);
    setFormData({ name: "", email: "", password: "" });
  };

  if (loggedInUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4">
        <div className="bg-zinc-800 p-6 sm:p-10 rounded-2xl shadow-lg max-w-md w-full text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-6">
            Xush kelibsiz, {loggedInUser.name}!
          </h2>
          <p className="mb-8 text-lg">Siz tizimga kirgansiz.</p>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 transition rounded-lg px-8 py-3 font-semibold text-lg"
          >
            Chiqish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-6 sm:p-10 rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg"
      >
        <img
          src={logo}
          alt="logo"
          className="mx-auto w-36 sm:w-44 md:w-52 mb-10"
        />
            <h2 className="text-3xl font-extrabold text-white mb-8 text-center">Ro'yxatdan o'tish / Kirish</h2>

        <label className="block mb-6 relative text-white">
          <FaEnvelope className="absolute top-4 left-4 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </label>

        <label className="block mb-6 relative text-white">
          <FaUser className="absolute top-4 left-4 text-gray-400" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ismingiz"
            className={`w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 ${
              emailExists ? "bg-zinc-600 cursor-not-allowed" : ""
            }`}
            required
            disabled={emailExists} 
          />
          {emailExists && (
            <p className="mt-1 text-sm text-yellow-400">
              Email avval ro'yxatdan o'tgan, iltimos ismni o'zgartirmang va parolni kiriting
            </p>
          )}
        </label>

        <label className="block mb-8 relative text-white">
          <FaLock className="absolute top-4 left-4 text-gray-400" />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Parol"
            className="w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
        </label>

        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 font-semibold text-lg text-white"
        >
          {emailExists ? "Kirish" : "Ro'yxatdan o'tish"}
        </button>
      </form>
    </div>
  );
}
