import { jsx as _jsx } from "react/jsx-runtime";
import React from "react";
const Genre = ({ data }) => {
    return (_jsx("div", { className: "flex overflow-auto gap-6", children: data?.map((item) => (_jsx("div", { className: "text-nowrap", children: item.name }, item.id))) }));
};
export default React.memo(Genre);
