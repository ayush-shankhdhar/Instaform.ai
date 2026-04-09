"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useParams, useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContext";
import { ArrowLeft, Download, Loader2, BarChart3, Inbox } from "lucide-react";

const Analytic = () => {
  const { token, theme } = useGlobalContext();
  const isDark = theme !== "light";
  const [count, setCount] = useState(0);
  const [responses, setResponses] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const { formNo } = useParams();
  const router = useRouter();

  const downloadCSV = async () => {
    setDownloading(true);
    try {
      const response = await axios.post(`/api/excel/download`, { formNo, token }, { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Responses_${formNo}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("Download complete!", { theme: isDark ? "dark" : "light" });
    } catch (error) {
      toast.error("Error downloading file", { theme: isDark ? "dark" : "light" });
    }
    setDownloading(false);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.post(`/api/analytics/get/${formNo}`, { token });
        if (response.data.responses) {
          setCount(response.data.responses.length);
          setResponses(response.data.responses);
        }
      } catch (error) {
        console.error("Error fetching analytics:", error);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div
      style={{
        marginLeft: "260px",
        width: "calc(100% - 260px)",
        minHeight: "100vh",
        padding: "40px 48px",
        background: isDark ? "var(--bg-primary)" : "var(--bg-primary-light)",
        transition: "background var(--transition-base)",
      }}
    >
      {/* Header */}
      <div className="animate-fade-in" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
        <button
          onClick={() => router.push("/forms")}
          style={{
            width: "40px", height: "40px", borderRadius: "var(--radius-md)",
            border: `1px solid ${isDark ? "var(--border-medium)" : "var(--border-medium-light)"}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", color: isDark ? "var(--text-primary)" : "var(--text-primary-light)",
            cursor: "pointer", transition: "all var(--transition-base)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent-purple)"; e.currentTarget.style.color = "var(--accent-purple)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = isDark ? "var(--border-medium)" : "var(--border-medium-light)"; e.currentTarget.style.color = isDark ? "var(--text-primary)" : "var(--text-primary-light)"; }}
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="gradient-text" style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.03em" }}>Analytics</h1>
          <p style={{ fontSize: "13px", color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }}>Form: {formNo}</p>
        </div>
      </div>

      <div style={{ height: "1px", background: isDark ? "var(--border-subtle)" : "var(--border-subtle-light)", marginBottom: "28px" }} />

      {/* Stats card */}
      <div
        className="animate-fade-in-up"
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "24px 32px", borderRadius: "var(--radius-lg)",
          background: "var(--gradient-primary)", marginBottom: "32px",
          boxShadow: "0 8px 32px rgba(139,92,246,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <BarChart3 size={24} style={{ color: "rgba(255,255,255,0.8)" }} />
          <span style={{ fontSize: "1rem", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>Total Responses</span>
        </div>
        <span style={{ fontSize: "3rem", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>{count}</span>
      </div>

      {/* Responses header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.3rem", fontWeight: 600, color: isDark ? "var(--text-primary)" : "var(--text-primary-light)" }}>Responses</h2>
        <button
          onClick={downloadCSV}
          disabled={downloading}
          style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "10px 20px", borderRadius: "var(--radius-md)",
            background: "#16a34a", color: "#fff", border: "none",
            cursor: "pointer", fontSize: "14px", fontWeight: 600,
            transition: "background var(--transition-base)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "#15803d"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "#16a34a"; }}
        >
          {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {downloading ? "Downloading…" : "Export CSV"}
        </button>
      </div>

      {/* Responses List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px", paddingBottom: "40px" }}>
        {responses.length > 0 ? (
          responses.map((resp, index) => (
            <div
              key={index}
              className="animate-fade-in-up"
              style={{
                padding: "20px 24px", borderRadius: "var(--radius-lg)",
                border: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`,
                background: isDark ? "var(--bg-card)" : "var(--bg-card-light)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px", paddingBottom: "10px", borderBottom: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}` }}>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 10px", borderRadius: "20px", background: "var(--gradient-glow)", color: "var(--accent-purple)" }}>
                  #{index + 1}
                </span>
              </div>
              {Object.entries(resp).map(([key, value], idx) => (
                <div key={idx} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "14px" }}>
                  <span style={{ fontWeight: 600, minWidth: "120px", color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)" }}>{key}:</span>
                  <span style={{ color: isDark ? "var(--text-primary)" : "var(--text-primary-light)" }}>{String(value)}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "64px 0", color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }}>
            <Inbox size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No responses yet</p>
            <p style={{ fontSize: "14px", marginTop: "4px" }}>Responses will appear here once users submit the form.</p>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme={isDark ? "dark" : "light"} transition={Bounce} />
    </div>
  );
};

export default Analytic;