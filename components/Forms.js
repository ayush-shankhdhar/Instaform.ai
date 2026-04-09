"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/GlobalContext";
import { Copy, ExternalLink, Trash2, BarChart3, Pencil, FileText, Loader2 } from "lucide-react";

const Forms = () => {
  const { token, formData, setFormData, theme } = useGlobalContext();
  const [loading, setLoading] = useState(true);
  const isDark = theme !== "light";
  const router = useRouter();

  const fetchForms = async () => {
    try {
      const response = await axios.post(`/api/user/forms`, { token });
      setFormData(response.data);
    } catch (error) {
      console.error("Error fetching forms:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (formNo) => {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    try {
      const res = await axios.post(`/api/ai/delete/${formNo}`, { token });
      if (res.data.msg) {
        toast.success("Form deleted successfully", { theme: isDark ? "dark" : "light" });
        fetchForms();
      }
      if (res.data.error) toast.error(res.data.error, { theme: isDark ? "dark" : "light" });
    } catch (error) {
      toast.error("Something went wrong!", { theme: isDark ? "dark" : "light" });
    }
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied to clipboard!", { theme: isDark ? "dark" : "light" });
  };

  useEffect(() => { fetchForms(); }, []);

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
      <div className="animate-fade-in" style={{ marginBottom: "32px" }}>
        <h1 className="gradient-text" style={{ fontSize: "2.2rem", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "8px" }}>My Forms</h1>
        <p style={{ fontSize: "15px", color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)" }}>
          Manage and track all your generated forms in one place.
        </p>
      </div>

      <div style={{ height: "1px", background: isDark ? "var(--border-subtle)" : "var(--border-subtle-light)", marginBottom: "28px" }} />

      {/* Forms list */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingBottom: "40px" }}>
        {loading ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "40px 0", justifyContent: "center" }}>
            <Loader2 size={24} className="animate-spin" style={{ color: "var(--accent-purple)" }} />
            <span style={{ color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)" }}>Loading forms…</span>
          </div>
        ) : formData.length > 0 ? (
          formData.map((form, index) => {
            const formUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/api/ai/form/${form.formNo}`;
            return (
              <div
                key={index}
                className="animate-fade-in-up"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  padding: "18px 24px",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`,
                  background: isDark ? "var(--bg-card)" : "var(--bg-card-light)",
                  transition: "all var(--transition-base)",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
              >
                {/* Left */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1, minWidth: 0 }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "var(--radius-md)", background: "var(--gradient-glow)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <FileText size={20} style={{ color: "var(--accent-purple)" }} />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: "15px", fontWeight: 600, color: isDark ? "var(--text-primary)" : "var(--text-primary-light)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{form.formName}</h3>
                    <p style={{ fontSize: "12px", color: "var(--accent-purple)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "300px" }}>{formUrl}</p>
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                  <button onClick={() => copyToClipboard(formUrl)} title="Copy URL"
                    style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", border: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)", cursor: "pointer", transition: "all var(--transition-fast)" }}>
                    <Copy size={16} />
                  </button>
                  <a href={formUrl} target="_blank" rel="noopener noreferrer">
                    <button style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", border: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`, display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)", cursor: "pointer", transition: "all var(--transition-fast)" }}>
                      <ExternalLink size={16} />
                    </button>
                  </a>
                  <button onClick={() => router.push(`/forms/analytics/${form.formNo}`)} className="btn-primary" style={{ padding: "8px 16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <BarChart3 size={15} /> Analytics
                  </button>
                  <button onClick={() => router.push("/editor/" + form.formNo)} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <Pencil size={15} /> Edit
                  </button>
                  <button onClick={() => handleDelete(form.formNo)} title="Delete"
                    style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", border: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", color: "#ef4444", cursor: "pointer", transition: "all var(--transition-fast)" }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: "center", padding: "64px 0", color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }}>
            <FileText size={48} style={{ margin: "0 auto 16px", opacity: 0.3 }} />
            <p style={{ fontSize: "1rem", fontWeight: 500 }}>No forms yet</p>
            <p style={{ fontSize: "14px", marginTop: "4px" }}>Create your first form using the AI generator.</p>
          </div>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} theme={isDark ? "dark" : "light"} transition={Bounce} />
    </div>
  );
};

export default Forms;