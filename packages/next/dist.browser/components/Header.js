import { jsx, jsxs } from "react/jsx-runtime";

;// CONCATENATED MODULE: external "react/jsx-runtime"

;// CONCATENATED MODULE: ./src/browser/components/Header.tsx

const Header = ()=>{
    return /*#__PURE__*/ jsxs("header", {
        className: "header",
        children: [
            /*#__PURE__*/ jsx("img", {
                src: "/logo.png",
                alt: "Cloud Push Logo",
                className: "header-logo"
            }),
            /*#__PURE__*/ jsx("h1", {
                className: "header-title",
                children: "Cloud Push Dashboard"
            })
        ]
    });
};

export { Header };
