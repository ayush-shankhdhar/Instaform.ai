"use client";
import { useRouter, useParams } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const GoogleCallback = () => {
    const router = useRouter();
    const { token } = useParams();

    useEffect(() => {
        if (token) {
            document.cookie = `token=${token}; Path=/; Secure; SameSite=None; Max-Age=${60 * 60 * 24 * 365};`;
            router.replace("/");
        }
    }, [token]);

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-primary)",
                gap: "16px",
            }}
        >
            <Loader2
                size={32}
                className="animate-spin"
                style={{ color: "var(--accent-purple)" }}
            />
            <p style={{ color: "var(--text-secondary)", fontSize: "15px" }}>
                Completing sign in…
            </p>
        </div>
    );
};

export default GoogleCallback;
