"use client";
import React from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { Loader2 } from "lucide-react";

const Splash = () => {
  const { theme, fadeOut } = useGlobalContext();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        transition: "opacity 0.5s",
        opacity: fadeOut ? 0 : 1,
        background: "var(--bg-primary)",
      }}
    >
      {/* Ambient orbs */}
      <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)", top: "20%", left: "15%", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", width: "250px", height: "250px", borderRadius: "50%", background: "radial-gradient(circle, rgba(217,70,239,0.08) 0%, transparent 70%)", bottom: "25%", right: "20%", filter: "blur(60px)" }} />

      {/* Logo */}
      <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", position: "relative", zIndex: 1 }}>
        <img src="/icon.png" alt="InstaForm AI" style={{ height: "80px", filter: "drop-shadow(0 0 24px rgba(139,92,246,0.3))" }} />
        <h1 className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>InstaForm AI</h1>
      </div>

      {/* Loading bar */}
      <div style={{ marginTop: "48px", width: "200px", height: "4px", borderRadius: "20px", background: "var(--bg-tertiary)", overflow: "hidden", position: "relative" }}>
        <div className="animate-slide" style={{ position: "absolute", height: "100%", width: "33%", borderRadius: "20px", background: "var(--gradient-primary)" }} />
      </div>
    </div>
  );
};

export default Splash;