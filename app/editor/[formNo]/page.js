"use client";
import { useGlobalContext } from "@/context/GlobalContext";
import axios from "axios";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { ArrowLeft, MousePointerClick, Type, Save, Loader2, RotateCcw, Eye } from "lucide-react";

function FormPreview() {
    const { theme, token } = useGlobalContext();
    const isDark = theme !== "light";
    const iframeRef = useRef(null);
    const { formNo } = useParams();
    const [originalHTML, setOriginalHTML] = useState("");
    const [HTML, setHTML] = useState("");
    const [clickedText, setClickedText] = useState("");
    const [selectedElement, setSelectedElement] = useState(null);
    const [selectedTag, setSelectedTag] = useState("");
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchForm() {
            try {
                const response = await axios.get(`/api/ai/form/${formNo}`);
                setHTML(response.data);
                setOriginalHTML(response.data);
            } catch (error) {
                console.error("Error fetching form:", error);
            }
            setLoading(false);
        }
        fetchForm();
    }, [formNo]);

    useEffect(() => {
        const attachClickHandler = () => {
            const iframe = iframeRef.current;
            if (!iframe) return;
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            if (!iframeDocument) return;

            const existingStyle = iframeDocument.getElementById("editor-styles");
            if (!existingStyle) {
                const style = iframeDocument.createElement("style");
                style.id = "editor-styles";
                style.textContent = `
          .editor-selected {
            outline: 2px solid #A78BFA !important;
            outline-offset: 2px;
            background: rgba(139, 92, 246, 0.08) !important;
            border-radius: 4px;
          }
          *[contenteditable]:hover {
            outline: 1px dashed rgba(139, 92, 246, 0.4) !important;
            outline-offset: 1px;
          }
        `;
                iframeDocument.head.appendChild(style);
            }

            const editableTags = [
                "label", "p", "span", "strong", "em", "b", "i",
                "h1", "h2", "h3", "h4", "h5", "h6",
                "button", "a", "li", "td", "th", "legend",
                "option", "figcaption", "summary", "small",
            ];

            const handleClickInsideIframe = (event) => {
                event.preventDefault();
                const target = event.target;
                const tagName = target.tagName.toLowerCase();

                if (tagName === "input" || tagName === "textarea") {
                    const placeholder = target.getAttribute("placeholder");
                    if (placeholder) {
                        setClickedText(placeholder);
                        setSelectedElement(target);
                        setSelectedTag(`${tagName} placeholder`);
                        iframeDocument.querySelectorAll(".editor-selected").forEach((el) => el.classList.remove("editor-selected"));
                        target.classList.add("editor-selected");
                        setHasChanges(true);
                        return;
                    }
                }

                if (!editableTags.includes(tagName)) return;
                const selectedText = target.innerText.trim();
                if (selectedText) {
                    iframeDocument.querySelectorAll(".editor-selected").forEach((el) => el.classList.remove("editor-selected"));
                    target.classList.add("editor-selected");
                    setClickedText(selectedText);
                    setSelectedElement(target);
                    setSelectedTag(tagName);
                }
            };

            iframeDocument.addEventListener("click", handleClickInsideIframe);
            return () => iframeDocument.removeEventListener("click", handleClickInsideIframe);
        };

        const iframe = iframeRef.current;
        if (iframe) iframe.onload = attachClickHandler;
    }, [HTML]);

    const handleTextChange = (e) => {
        const newText = e.target.value;
        setClickedText(newText);
        setHasChanges(true);
        if (selectedElement) {
            const tagName = selectedElement.tagName.toLowerCase();
            if (tagName === "input" || tagName === "textarea") {
                selectedElement.setAttribute("placeholder", newText);
                return;
            }
            const radioInput = selectedElement.querySelector('input[type="radio"], input[type="checkbox"]');
            if (radioInput) {
                selectedElement.innerHTML = "";
                selectedElement.appendChild(radioInput);
                selectedElement.appendChild(document.createTextNode(" " + newText));
            } else {
                selectedElement.innerText = newText;
            }
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const iframe = iframeRef.current;
            if (!iframe) return;
            const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            iframeDocument.querySelectorAll(".editor-selected").forEach((el) => el.classList.remove("editor-selected"));
            const editorStyle = iframeDocument.getElementById("editor-styles");
            if (editorStyle) editorStyle.remove();

            const updatedHTML = "<!DOCTYPE html>" + iframeDocument.documentElement.outerHTML;
            const res = await axios.post(`/api/ai/update/${formNo}`, { token, body: updatedHTML });
            if (res.data.msg) {
                toast.success("Form saved successfully!", { theme: isDark ? "dark" : "light" });
                setOriginalHTML(updatedHTML);
                setHasChanges(false);
            }
            if (res.data.error) toast.error(res.data.error, { theme: isDark ? "dark" : "light" });
        } catch (error) {
            toast.error("Failed to save form", { theme: isDark ? "dark" : "light" });
        }
        setSaving(false);
    };

    const handleReset = () => {
        setHTML(originalHTML);
        setClickedText("");
        setSelectedElement(null);
        setSelectedTag("");
        setHasChanges(false);
        toast.info("Reset to last saved version", { theme: isDark ? "dark" : "light" });
    };

    if (loading) {
        return (
            <div style={{ width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: isDark ? "var(--bg-primary)" : "var(--bg-primary-light)" }}>
                <Loader2 size={32} className="animate-spin" style={{ color: "var(--accent-purple)" }} />
            </div>
        );
    }

    return (
        <div style={{ width: "100%", minHeight: "100vh", display: "flex", flexDirection: "column", background: isDark ? "var(--bg-primary)" : "var(--bg-primary-light)" }}>
            {/* Top Bar */}
            <header
                style={{
                    position: "fixed", top: 0, left: 0, right: 0, height: "64px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "0 24px", zIndex: 50,
                    background: isDark ? "var(--bg-secondary)" : "var(--bg-secondary-light)",
                    borderBottom: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`,
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Link href="/forms">
                        <button
                            className="btn-secondary"
                            style={{ padding: "8px 14px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}
                        >
                            <ArrowLeft size={16} /> Back
                        </button>
                    </Link>
                    {hasChanges && (
                        <span style={{ fontSize: "12px", fontWeight: 500, padding: "4px 10px", borderRadius: "20px", background: "rgba(234,179,8,0.12)", color: "#eab308" }}>
                            Unsaved changes
                        </span>
                    )}
                </div>

                <h1 className="gradient-text" style={{ fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em" }}>Form Editor</h1>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={handleReset} disabled={!hasChanges} className="btn-secondary"
                        style={{ padding: "8px 14px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", opacity: hasChanges ? 1 : 0.4 }}>
                        <RotateCcw size={15} /> Reset
                    </button>
                    <a href={`/api/ai/form/${formNo}`} target="_blank" rel="noopener noreferrer">
                        <button className="btn-secondary" style={{ padding: "8px 14px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px" }}>
                            <Eye size={15} /> Preview
                        </button>
                    </a>
                    <button onClick={handleSave} disabled={saving || !hasChanges} className="btn-primary"
                        style={{ padding: "8px 20px", fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", opacity: (saving || !hasChanges) ? 0.5 : 1 }}>
                        {saving ? <><Loader2 size={15} className="animate-spin" /> Saving…</> : <><Save size={15} /> Save Changes</>}
                    </button>
                </div>
            </header>

            {/* Content */}
            <div style={{ display: "flex", marginTop: "64px", height: "calc(100vh - 64px)" }}>
                {/* Preview */}
                <div style={{ flex: 1, overflow: "hidden" }}>
                    <iframe ref={iframeRef} srcDoc={HTML} style={{ width: "100%", height: "100%", border: "none", background: "#fff" }} title="Form Preview" />
                </div>

                {/* Edit Panel */}
                <div
                    style={{
                        width: "360px", flexShrink: 0, padding: "24px",
                        display: "flex", flexDirection: "column", gap: "16px",
                        overflowY: "auto",
                        background: isDark ? "var(--bg-secondary)" : "var(--bg-secondary-light)",
                        borderLeft: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`,
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "4px", color: isDark ? "var(--text-primary)" : "var(--text-primary-light)" }}>Edit Content</h2>
                        <p style={{ fontSize: "13px", color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }}>
                            Click on any text, label, heading, button, or placeholder in the form to edit it.
                        </p>
                    </div>

                    <div style={{ height: "1px", background: isDark ? "var(--border-subtle)" : "var(--border-subtle-light)" }} />

                    {clickedText ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px", flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "4px 12px", borderRadius: "var(--radius-sm)", background: "var(--gradient-glow)", fontSize: "12px", fontWeight: 600, color: "var(--accent-purple)" }}>
                                    <Type size={13} /> {selectedTag.toUpperCase()}
                                </div>
                                <button
                                    onClick={() => {
                                        setClickedText(""); setSelectedElement(null); setSelectedTag("");
                                        const iframe = iframeRef.current;
                                        if (iframe) {
                                            const doc = iframe.contentDocument || iframe.contentWindow.document;
                                            doc.querySelectorAll(".editor-selected").forEach((el) => el.classList.remove("editor-selected"));
                                        }
                                    }}
                                    style={{ fontSize: "12px", background: "transparent", border: "none", color: isDark ? "var(--text-muted)" : "var(--text-muted-light)", cursor: "pointer", textDecoration: "underline" }}
                                >
                                    Deselect
                                </button>
                            </div>

                            <label style={{ fontSize: "13px", fontWeight: 500, color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)" }}>Content</label>
                            <textarea
                                value={clickedText}
                                onChange={handleTextChange}
                                className="input-field"
                                style={{ minHeight: "180px", resize: "vertical", lineHeight: 1.6, fontFamily: "inherit" }}
                            />
                            <p style={{ fontSize: "12px", lineHeight: 1.5, color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }}>
                                Changes are reflected live in the preview. Click <strong>Save Changes</strong> to persist your edits.
                            </p>
                        </div>
                    ) : (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px", padding: "32px 16px" }}>
                            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(139,92,246,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <MousePointerClick size={28} style={{ color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }} />
                            </div>
                            <div style={{ textAlign: "center" }}>
                                <p style={{ fontSize: "15px", fontWeight: 500, marginBottom: "6px", color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)" }}>Select an element</p>
                                <p style={{ fontSize: "13px", lineHeight: 1.5, color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }}>
                                    Click on any text in the form preview to edit it. Selected elements will be highlighted with a purple border.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <ToastContainer position="top-right" autoClose={3000} theme={isDark ? "dark" : "light"} transition={Bounce} />
        </div>
    );
}

export default FormPreview;
