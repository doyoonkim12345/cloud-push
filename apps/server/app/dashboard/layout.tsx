import { CloudPushProvider } from '@cloud-push/next/client'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <CloudPushProvider>
            {children}
        </CloudPushProvider>
    )
}