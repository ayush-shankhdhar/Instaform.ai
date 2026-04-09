"use client";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Mail, Lock, User, ArrowRight, Loader2 } from "lucide-react";

const SignupForm = () => {
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            toast.error("Please fill in all fields", { theme: "dark" });
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be at least 6 characters", { theme: "dark" });
            return;
        }
        setLoading(true);
        try {
            const response = await axios.post(`/api/auth2/signup`, { name, email, password });
            if (response.data.msg === "Signup Successful") {
                document.cookie = `token=${response.data.token}; Path=/; Secure; SameSite=None; Max-Age=${60 * 60 * 24 * 365};`;
                router.push("/");
            }
            if (response.data.error) {
                toast.error(response.data.error, { theme: "dark" });
            }
        } catch (error) {
            toast.error("Something went wrong!", { theme: "dark" });
        }
        setLoading(false);
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                background: "var(--bg-primary)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(217,70,239,0.08) 0%, transparent 70%)", top: "-10%", left: "-5%", filter: "blur(80px)" }} />
            <div style={{ position: "absolute", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)", bottom: "10%", right: "20%", filter: "blur(80px)" }} />

            {/* Left – Form */}
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px", position: "relative", zIndex: 1 }}>
                <div className="glass animate-fade-in-up" style={{ width: "100%", maxWidth: "420px", padding: "40px", borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-card)" }}>
                    <div className="md:hidden" style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                        <img src="/icon.png" alt="InstaForm AI" style={{ height: "40px" }} />
                    </div>

                    <h1 style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "4px", color: "var(--text-primary)" }}>Create your account</h1>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "32px" }}>Get started with InstaForm AI for free</p>

                    <form onSubmit={handleSignup} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ position: "relative" }}>
                            <User size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="input-field" style={{ paddingLeft: "42px" }} />
                        </div>
                        <div style={{ position: "relative" }}>
                            <Mail size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" className="input-field" style={{ paddingLeft: "42px" }} />
                        </div>
                        <div style={{ position: "relative" }}>
                            <Lock size={18} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min. 6 characters)" className="input-field" style={{ paddingLeft: "42px" }} />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "13px", fontSize: "15px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginTop: "8px" }}>
                            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
                        </button>
                    </form>

                    <div style={{ display: "flex", alignItems: "center", gap: "16px", margin: "24px 0" }}>
                        <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
                        <span style={{ fontSize: "12px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em" }}>or</span>
                        <div style={{ flex: 1, height: "1px", background: "var(--border-subtle)" }} />
                    </div>

                    <button type="button" onClick={() => signIn("google")} className="btn-secondary" style={{ width: "100%", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", fontSize: "14px" }}>
                        <FcGoogle size={20} /> Continue with Google
                    </button>

                    <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-secondary)" }}>
                        Already have an account?{" "}
                        <a onClick={() => router.push("/login")} style={{ color: "var(--accent-purple)", cursor: "pointer", fontWeight: 600, textDecoration: "none" }}
                            onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                            onMouseLeave={(e) => (e.target.style.textDecoration = "none")}>
                            Sign in
                        </a>
                    </p>
                </div>
            </div>

            {/* Right – Branding */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "48px", position: "relative", zIndex: 1 }} className="hidden md:flex">
                <div className="animate-fade-in" style={{ maxWidth: "420px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
                        <img src="/icon.png" alt="InstaForm AI" style={{ height: "48px", filter: "drop-shadow(0 0 16px rgba(139,92,246,0.3))" }} />
                        <span className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>InstaForm AI</span>
                    </div>
                    <h2 style={{ fontSize: "2.4rem", fontWeight: 700, lineHeight: 1.2, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "-0.02em" }}>
                        From prompt to form<br /><span className="gradient-text">in seconds.</span>
                    </h2>
                    <p style={{ fontSize: "1.05rem", color: "var(--text-secondary)", lineHeight: 1.7 }}>
                        Simply describe the form you need and our AI will generate a production-ready, responsive form with analytics built in.
                    </p>
                    <div style={{ display: "flex", gap: "8px", marginTop: "32px", flexWrap: "wrap" }}>
                        {["AI-Powered", "Beautiful Design", "Export to CSV", "Live Analytics"].map((f) => (
                            <span key={f} style={{ padding: "6px 14px", borderRadius: "20px", fontSize: "13px", fontWeight: 500, background: "var(--gradient-glow)", border: "1px solid var(--border-subtle)", color: "var(--accent-purple)" }}>{f}</span>
                        ))}
                    </div>
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={4000} theme="dark" transition={Bounce} />
        </div>
    );
};

export default SignupForm;