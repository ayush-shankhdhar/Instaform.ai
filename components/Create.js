"use client";
import React, { useState } from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { useGlobalContext } from "@/context/GlobalContext";
import axios from "axios";
import {
  Copy, ExternalLink, X, Loader2, Sparkles,
  MessageSquare, ClipboardList, HelpCircle, UserRound, CheckCircle2,
} from "lucide-react";

const Create = () => {
  const { user, token, theme } = useGlobalContext();
  const isDark = theme !== "light";
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [formUrl, setFormUrl] = useState(null);

  const promptTemplates = [
    {
      title: "Contact Form",
      desc: "Professional contact with validation",
      icon: ClipboardList,
      prompt:
        "Create a professional Contact Us form with these sections:\n- Personal Info: Full Name (required, placeholder: 'John Doe'), Email Address (required, email type), Phone Number (optional, tel type with placeholder '+1 (555) 000-0000').\n- Message Section: Subject dropdown (General Inquiry, Technical Support, Partnership, Feedback, Other), Message textarea (required, min 50 chars, placeholder: 'Tell us how we can help you...').\n- Preferred contact method: radio buttons (Email, Phone, Either).\n- A subtle note above submit: 'We typically respond within 24 hours.'\nMake it feel premium and trustworthy.",
    },
    {
      title: "Feedback Form",
      desc: "Star ratings, categories & NPS",
      icon: MessageSquare,
      prompt:
        "Create a detailed Customer Feedback form with:\n- Name (optional) and Email (required).\n- Overall Experience: 5 visual rating buttons labeled 1-5 (1=Poor, 5=Excellent) styled as selectable pills, currently none selected.\n- Category dropdown: Product Quality, Customer Service, Website Experience, Delivery, Pricing.\n- What did we do well? (textarea, placeholder: 'Tell us what you loved...').\n- What can we improve? (textarea, placeholder: 'Share your suggestions...').\n- Would you recommend us? (radio: Definitely, Probably, Not Sure, Probably Not, Definitely Not).\n- Checkbox: 'I'd like to be contacted about my feedback'.\nMake the rating section visually interesting with colored pills.",
    },
    {
      title: "Event RSVP",
      desc: "Registration, dietary & preferences",
      icon: HelpCircle,
      prompt:
        "Create an Event Registration / RSVP form with:\n- Attendee Info: Full Name (required), Email (required), Phone (optional).\n- Event Details: Number of Guests (number input, 1-10), Attendance Type (radio: In-Person, Virtual, Undecided).\n- Dietary Requirements: checkboxes (None, Vegetarian, Vegan, Gluten-Free, Halal, Kosher, Other with text input).\n- T-Shirt Size dropdown: XS, S, M, L, XL, XXL.\n- How did you hear about this event? dropdown: Social Media, Email, Friend/Colleague, Website, Other.\n- Special Requirements or Accessibility Needs (optional textarea).\n- Checkbox: 'I agree to the event terms and conditions' (required).\nAdd a friendly header with event branding feel.",
    },
    {
      title: "Job Application",
      desc: "Resume, experience & skills",
      icon: UserRound,
      prompt:
        "Create a Job Application form with clear sections:\n- Section 1 - Personal Details: Full Name (required), Email (required), Phone Number (required), City/Location (text input).\n- Section 2 - Professional Info: Position Applied For dropdown (Software Engineer, Product Designer, Marketing Manager, Data Analyst, Other), Years of Experience (number input), Current Company (optional), LinkedIn Profile URL (optional, url type).\n- Section 3 - Skills & Qualifications: Highest Education dropdown (High School, Bachelor's, Master's, PhD, Other), Key Skills (textarea, placeholder: 'e.g. JavaScript, React, Project Management'), Why are you a good fit? (textarea, required, min 100 chars).\n- Section 4 - Availability: Earliest Start Date (date input), Work Type Preference (radio: Full-time, Part-time, Contract, Remote).\n- Checkbox: 'I confirm all information provided is accurate' (required).\nUse clear section headers with subtle dividers between groups.",
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(formUrl);
    toast.success("Copied to clipboard!", { theme: isDark ? "dark" : "light" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Please enter a prompt", { theme: isDark ? "dark" : "light" });
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`/api/ai/generate-content`, { prompt, token });
      const data = response.data;
      if (data.msg === "Success") {
        setFormUrl(`${window.location.origin}/api/ai/form/${data.formNo}`);
        setPrompt("");
      }
      if (data.error) {
        toast.error(data.error, { theme: isDark ? "dark" : "light" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!", { theme: isDark ? "dark" : "light" });
    }
    setLoading(false);
  };

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div
      style={{
        marginLeft: "260px",
        width: "calc(100% - 260px)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 48px",
        position: "relative",
        background: isDark ? "var(--bg-primary)" : "var(--bg-primary-light)",
        transition: "background var(--transition-base)",
      }}
    >
      {/* Background orb */}
      <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(139,92,246,0.04) 0%, transparent 70%)", top: "10%", right: "-10%", filter: "blur(80px)", pointerEvents: "none" }} />

      <div style={{ maxWidth: "780px", width: "100%", position: "relative", zIndex: 1 }}>
        {/* Greeting */}
        <div className="animate-fade-in" style={{ marginBottom: "40px" }}>
          <h1 style={{ fontSize: "2.6rem", fontWeight: 700, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "12px" }}>
            <span style={{ color: isDark ? "var(--text-primary)" : "var(--text-primary-light)" }}>Hi {firstName}, </span>
            <br />
            <span className="gradient-text">What would you like to create?</span>
          </h1>
          <p style={{ fontSize: "1rem", color: isDark ? "var(--text-secondary)" : "var(--text-secondary-light)" }}>
            Pick a template below or write your own prompt to generate a form.
          </p>
        </div>

        {/* Template Cards */}
        <div className="animate-fade-in-up" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px", marginBottom: "28px" }}>
          {promptTemplates.map((tmpl, i) => {
            const Icon = tmpl.icon;
            return (
              <button
                key={i}
                onClick={() => setPrompt(tmpl.prompt)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  padding: "20px",
                  borderRadius: "var(--radius-lg)",
                  border: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`,
                  background: isDark ? "var(--bg-card)" : "var(--bg-card-light)",
                  textAlign: "left",
                  cursor: "pointer",
                  transition: "all var(--transition-base)",
                  minHeight: "130px",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.borderColor = "var(--accent-purple)";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(139,92,246,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = isDark ? "var(--border-subtle)" : "var(--border-subtle-light)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div>
                  <p style={{ fontSize: "15px", fontWeight: 600, marginBottom: "4px", color: isDark ? "var(--text-primary)" : "var(--text-primary-light)" }}>{tmpl.title}</p>
                  <p style={{ fontSize: "13px", color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }}>{tmpl.desc}</p>
                </div>
                <Icon size={20} style={{ color: "var(--accent-purple)", marginTop: "12px" }} />
              </button>
            );
          })}
        </div>

        {/* Prompt Input */}
        <div
          className="animate-fade-in-up"
          style={{
            borderRadius: "var(--radius-lg)",
            border: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`,
            background: isDark ? "var(--bg-card)" : "var(--bg-card-light)",
            overflow: "hidden",
            transition: "border-color var(--transition-base)",
          }}
        >
          <textarea
            value={prompt}
            onChange={(e) => { if (e.target.value.length <= 10000) setPrompt(e.target.value); }}
            placeholder="Describe the form you want to create..."
            style={{
              width: "100%",
              minHeight: "140px",
              padding: "20px 24px",
              border: "none",
              outline: "none",
              resize: "none",
              fontSize: "15px",
              lineHeight: 1.6,
              background: "transparent",
              color: isDark ? "var(--text-primary)" : "var(--text-primary-light)",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "12px 20px",
              borderTop: `1px solid ${isDark ? "var(--border-subtle)" : "var(--border-subtle-light)"}`,
            }}
          >
            <span style={{ fontSize: "13px", color: isDark ? "var(--text-muted)" : "var(--text-muted-light)" }}>
              {prompt.length.toLocaleString()} / 10,000
            </span>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary"
              style={{ padding: "10px 20px", fontSize: "14px", display: "flex", alignItems: "center", gap: "8px" }}
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> Generating…</>
              ) : (
                <><Sparkles size={18} /> Generate Form</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {formUrl && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: "24px" }}
          onClick={() => setFormUrl(null)}
        >
          <div
            className="glass animate-scale-in"
            style={{ width: "100%", maxWidth: "520px", padding: "40px", borderRadius: "var(--radius-2xl)", textAlign: "center", boxShadow: "var(--shadow-glow)", position: "relative" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setFormUrl(null)} style={{ position: "absolute", top: "16px", right: "16px", background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>
              <X size={20} />
            </button>

            <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(34,197,94,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <CheckCircle2 size={28} style={{ color: "#22c55e" }} />
            </div>

            <h2 className="gradient-text" style={{ fontSize: "1.6rem", fontWeight: 700, marginBottom: "8px" }}>Form Created!</h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px" }}>Your form is live and ready to collect responses.</p>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "var(--radius-md)", background: isDark ? "var(--bg-tertiary)" : "var(--bg-tertiary-light)", marginBottom: "24px" }}>
              <p style={{ flex: 1, fontSize: "13px", color: "var(--accent-purple)", wordBreak: "break-all", textAlign: "left" }}>{formUrl}</p>
              <button onClick={copyToClipboard} style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer", flexShrink: 0 }}>
                <Copy size={18} />
              </button>
              <a href={formUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-secondary)", flexShrink: 0 }}>
                <ExternalLink size={18} />
              </a>
            </div>

            <button onClick={() => setFormUrl(null)} className="btn-primary" style={{ width: "100%", padding: "12px", fontSize: "14px" }}>
              Create Another Form
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={4000} theme={isDark ? "dark" : "light"} transition={Bounce} />
    </div>
  );
};

export default Create;