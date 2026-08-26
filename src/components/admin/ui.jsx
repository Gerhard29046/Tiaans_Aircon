import React from "react";

export const fieldCls =
  "w-full px-4 py-3 rounded-2xl bg-white/8 border border-white/15 text-white placeholder:text-white/35 focus:outline-none focus:ring-2 focus:ring-[#6DD5F7]";

export function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-white/80 mb-2">{label}</span>
      {children}
    </label>
  );
}

export function Toggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`px-4 py-2.5 rounded-full text-sm font-bold transition-colors ${
        checked ? "bg-[#2D8CCB] text-white" : "bg-white/10 text-white/60"
      }`}
    >
      {label}
    </button>
  );
}

/** @param {{children: React.ReactNode, onClick?: React.MouseEventHandler<HTMLButtonElement>, type?: "button" | "submit" | "reset", variant?: "primary" | "ghost" | "danger", className?: string}} props */
export function AdminButton({ children, onClick, type = "button", variant = "primary", className = "" }) {
  const styles = {
    primary: "bg-[#2D8CCB] text-white hover:bg-[#6DD5F7] hover:text-[#0A2948]",
    ghost: "bg-white/10 text-white hover:bg-white/20",
    danger: "bg-[#C8102E]/90 text-white hover:bg-[#C8102E]",
  };
  return (
    <button type={type} onClick={onClick} className={`px-5 py-3 rounded-full font-bold text-sm transition-colors ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Card({ children, className = "" }) {
  return <div className={`p-5 rounded-3xl bg-white/6 border border-white/12 ${className}`}>{children}</div>;
}
