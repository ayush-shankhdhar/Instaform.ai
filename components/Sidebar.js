"use client";
import React from "react";
import { useGlobalContext } from "@/context/GlobalContext";
import { Moon, Sun, LayoutDashboard, FileText, LogOut, Sparkles } from "lucide-react";
import Link from "next/link";

const Sidebar = (props) => {
  const { tabSelected } = props;
  const { theme, setTheme, user } = useGlobalContext();
  const isDark = theme !== "light";

  const themeSetter = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  const navItems = [
    { label: "Create", icon: Sparkles, href: "/", index: 0 },
    { label: "My Forms", icon: FileText, href: "/forms", index: 1 },
  ];

  const initials = user?.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "?";

  return (
    <aside
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: "260px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "24px 16px",
        background: isDark ? "var(--bg-secondary)" : "var(--bg-secondary-light)",
        borderRight: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`,
        zIndex: 40,
        transition: "background var(--transition-base), border var(--transition-base)",
      }}
    >
      {/* Top Section */}
      <div>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "8px 12px",
              marginBottom: "40px",
            }}
          >
            <img
              src="/icon.png"
              alt="InstaForm AI"
              style={{
                height: "36px",
                width: "auto",
                filter: "drop-shadow(0 0 8px rgba(139,92,246,0.2))",
              }}
            />
            <span
              className="gradient-text"
              style={{
                fontSize: "1.35rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
              }}
            >
              InstaForm AI
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {navItems.map((item) => {
            const isActive = tabSelected === item.index;
            const Icon = item.icon;
            return (
              <Link key={item.index} href={item.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-md)",
                    cursor: "pointer",
                    transition: "all var(--transition-base)",
                    background: isActive
                      ? "var(--gradient-primary)"
                      : "transparent",
                    color: isActive
                      ? "#fff"
                      : isDark
                        ? "var(--text-secondary)"
                        : "var(--text-secondary-light)",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "15px",
                    boxShadow: isActive ? "0 4px 16px rgba(139,92,246,0.25)" : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = isDark
                        ? "var(--bg-tertiary)"
                        : "var(--bg-tertiary-light)";
                      e.currentTarget.style.color = isDark
                        ? "var(--text-primary)"
                        : "var(--text-primary-light)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = isDark
                        ? "var(--text-secondary)"
                        : "var(--text-secondary-light)";
                    }
                  }}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* User Info */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "12px",
            borderRadius: "var(--radius-md)",
            background: isDark ? "var(--bg-tertiary)" : "var(--bg-tertiary-light)",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ overflow: "hidden", flex: 1 }}>
            <p
              style={{
                fontSize: "14px",
                fontWeight: 600,
                color: isDark ? "var(--text-primary)" : "var(--text-primary-light)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name || "Loading..."}
            </p>
            <p
              style={{
                fontSize: "12px",
                color: isDark ? "var(--text-muted)" : "var(--text-muted-light)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.email || ""}
            </p>
          </div>
        </div>

        {/* Theme + Logout */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={themeSetter}
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "10px",
              borderRadius: "var(--radius-md)",
              border: `1px solid ${isDark ? "var(--border-medium)" : "var(--border-medium-light)"}`,
              background: "transparent",
              color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              transition: "all var(--transition-base)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent-purple)";
              e.currentTarget.style.color = "var(--accent-purple)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark ? "var(--border-medium)" : "var(--border-medium-light)";
              e.currentTarget.style.color = isDark ? "var(--text-secondary)" : "var(--text-secondary-light)";
            }}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
            {isDark ? "Light" : "Dark"}
          </button>

          <Link href="/logout" style={{ flex: 1, textDecoration: "none" }}>
            <button
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "10px",
                borderRadius: "var(--radius-md)",
                border: "1px solid rgba(239,68,68,0.3)",
                background: "transparent",
                color: "#ef4444",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                transition: "all var(--transition-base)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239,68,68,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              <LogOut size={16} />
              Logout
            </button>
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;