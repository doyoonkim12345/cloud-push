import { jsx } from "react/jsx-runtime";
import { Suspense } from "react";
import { ReactQueryProvider } from "./ReactQueryProvider.js";

;// CONCATENATED MODULE: external "react/jsx-runtime"

;// CONCATENATED MODULE: external "react"

;// CONCATENATED MODULE: external "./ReactQueryProvider.js"

;// CONCATENATED MODULE: ./src/browser/components/CloudPushProvider.tsx



function CloudPushProvider({ children }) {
    return /*#__PURE__*/ jsx(ReactQueryProvider, {
        children: /*#__PURE__*/ jsx(Suspense, {
            children: children
        })
    });
}

export { CloudPushProvider };
