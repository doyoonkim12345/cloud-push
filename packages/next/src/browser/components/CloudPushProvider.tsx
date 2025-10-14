import { Suspense } from "react";
import { ReactQueryProvider } from "./ReactQueryProvider";

export function CloudPushProvider({ children }: { children: React.ReactNode }) {
    return (
        <ReactQueryProvider>
            <Suspense>
                {children}
            </Suspense>
        </ ReactQueryProvider >
    )
}