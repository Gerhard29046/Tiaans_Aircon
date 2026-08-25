import React from "react";

export default function AirflowBg({ className = "", opacity = 0.5 }) {
  return (
    <svg
      className={`pointer-events-none absolute inset-0 w-full h-full ${className}`}
      viewBox="0 0 1440 600"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ opacity }}
    >
      <defs>
        <linearGradient id="flow1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#174A7E" stopOpacity="0" />
          <stop offset="45%" stopColor="#2D8CCB" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6DD5F7" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path className="airflow-line" d="M-100 420 C 260 300, 520 520, 820 380 S 1240 200, 1560 320" fill="none" stroke="url(#flow1)" strokeWidth="2" />
      <path className="airflow-line airflow-delay" d="M-100 480 C 300 380, 600 580, 900 440 S 1280 280, 1560 400" fill="none" stroke="url(#flow1)" strokeWidth="1.2" />
      <path className="airflow-line" d="M-100 300 C 300 200, 640 380, 980 240 S 1300 120, 1560 220" fill="none" stroke="url(#flow1)" strokeWidth="1" />
    </svg>
  );
}