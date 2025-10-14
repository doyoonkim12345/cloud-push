"use client";
import { jsx } from "react/jsx-runtime";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

;// CONCATENATED MODULE: external "react/jsx-runtime"

;// CONCATENATED MODULE: external "@tanstack/react-query"

;// CONCATENATED MODULE: external "react"

;// CONCATENATED MODULE: ./src/browser/components/ReactQueryProvider.tsx



function ReactQueryProvider({ children }) {
    const [client] = useState(()=>new QueryClient());
    return /*#__PURE__*/ jsx(QueryClientProvider, {
        client: client,
        children: children
    });
}

export { ReactQueryProvider };
