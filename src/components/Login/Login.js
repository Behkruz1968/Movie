import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import logo from "@/assets/main-logo.svg";
export default function LoginPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [users, setUsers] = useState([]);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [emailExists, setEmailExists] = useState(false);
    const checkEmailExists = (email) => users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    useEffect(() => {
        const storedUsers = localStorage.getItem("users");
        if (storedUsers)
            setUsers(JSON.parse(storedUsers));
        const storedUser = localStorage.getItem("user");
        if (storedUser)
            setLoggedInUser(JSON.parse(storedUser));
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (name === "email") {
            const foundUser = checkEmailExists(value);
            setEmailExists(!!foundUser);
            if (foundUser) {
                setFormData((prev) => ({ ...prev, name: foundUser.name }));
            }
            else {
                setFormData((prev) => ({ ...prev, name: "" }));
            }
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.email || !formData.name || !formData.password) {
            alert("Iltimos, barcha maydonlarni to‘ldiring");
            return;
        }
        if (emailExists) {
            const existingUser = checkEmailExists(formData.email);
            if (existingUser &&
                existingUser.name === formData.name &&
                existingUser.password === formData.password) {
                localStorage.setItem("user", JSON.stringify(existingUser));
                setLoggedInUser(existingUser);
                alert("Tizimga muvaffaqiyatli kirdingiz!");
            }
            else {
                alert("Email avval ro'yxatdan o'tgan, lekin ism yoki parol noto‘g‘ri.");
            }
        }
        else {
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
        return (_jsx("div", { className: "min-h-screen flex flex-col items-center justify-center bg-zinc-900 text-white px-4", children: _jsxs("div", { className: "bg-zinc-800 p-6 sm:p-10 rounded-2xl shadow-lg max-w-md w-full text-center", children: [_jsxs("h2", { className: "text-3xl sm:text-4xl font-extrabold mb-6", children: ["Xush kelibsiz, ", loggedInUser.name, "!"] }), _jsx("p", { className: "mb-8 text-lg", children: "Siz tizimga kirgansiz." }), _jsx("button", { onClick: handleLogout, className: "bg-red-600 hover:bg-red-700 transition rounded-lg px-8 py-3 font-semibold text-lg", children: "Chiqish" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-zinc-900 px-4", children: _jsxs("form", { onSubmit: handleSubmit, className: "bg-zinc-800 p-6 sm:p-10 rounded-2xl shadow-lg w-full max-w-md sm:max-w-lg", children: [_jsx("img", { src: logo, alt: "logo", className: "mx-auto w-36 sm:w-44 md:w-52 mb-10" }), _jsx("h2", { className: "text-3xl font-extrabold text-white mb-8 text-center", children: "Ro'yxatdan o'tish / Kirish" }), _jsxs("label", { className: "block mb-6 relative text-white", children: [_jsx(FaEnvelope, { className: "absolute top-4 left-4 text-gray-400" }), _jsx("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "Email", className: "w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600", required: true })] }), _jsxs("label", { className: "block mb-6 relative text-white", children: [_jsx(FaUser, { className: "absolute top-4 left-4 text-gray-400" }), _jsx("input", { type: "text", name: "name", value: formData.name, onChange: handleChange, placeholder: "Ismingiz", className: `w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600 ${emailExists ? "bg-zinc-600 cursor-not-allowed" : ""}`, required: true, disabled: emailExists }), emailExists && (_jsx("p", { className: "mt-1 text-sm text-yellow-400", children: "Email avval ro'yxatdan o'tgan, iltimos ismni o'zgartirmang va parolni kiriting" }))] }), _jsxs("label", { className: "block mb-8 relative text-white", children: [_jsx(FaLock, { className: "absolute top-4 left-4 text-gray-400" }), _jsx("input", { type: "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "Parol", className: "w-full pl-12 pr-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-red-600", required: true })] }), _jsx("button", { type: "submit", className: "w-full bg-red-600 hover:bg-red-700 transition rounded-lg py-3 font-semibold text-lg text-white", children: emailExists ? "Kirish" : "Ro'yxatdan o'tish" })] }) }));
}
