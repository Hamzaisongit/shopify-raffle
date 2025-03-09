import { AuthProvider } from "@/components/auth/AuthProvider";

export default function AdminLayout({children}){
    return(
        <AuthProvider>
            {children}
        </AuthProvider>
    )
}