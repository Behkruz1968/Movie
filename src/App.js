import { jsx as _jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import MainRouter from "./pages";
const App = () => {
    return (_jsx("div", { className: "dark:bg-black dark:text-white bg-slate-100", children: _jsx(Suspense, { fallback: _jsx("p", { children: _jsx("img", { src: "https://cdn.dribbble.com/userupload/20130364/file/original-73e42728803da21a9265791e477cb3f2.gif", alt: "", className: "w-96 h-96" }) }), children: _jsx(MainRouter, {}) }) }));
};
export default App;
