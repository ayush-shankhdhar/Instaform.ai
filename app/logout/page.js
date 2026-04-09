"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
    const router = useRouter();

    useEffect(() => {
        document.cookie = "token=; Path=/; Max-Age=0;";
        setTimeout(() => router.push("/login"), 1000);
    }, [router]);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" }}>
            <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent-purple)", marginBottom: "16px" }} />
            <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Signing out…</p>
        </div>
    );
}
