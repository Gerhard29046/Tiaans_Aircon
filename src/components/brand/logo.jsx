import React from "react";

export default function Logo({ light = false, className = "" }) {
  return (
    <img
      src="/media/tiaans-logo.png"
      alt="Tiaan's Aircon Regas"
      width="1774"
      height="887"
      data-variant={light ? "light" : "default"}
      className={`block w-28 sm:w-32 h-auto ${className}`}
    />
  );
}
