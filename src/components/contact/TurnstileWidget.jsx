import React, { useEffect, useRef } from "react";

const SCRIPT_ID = "cloudflare-turnstile-script";
const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function loadTurnstile() {
  if (window.turnstile) return Promise.resolve(window.turnstile);

  return new Promise((resolve, reject) => {
    let script = /** @type {HTMLScriptElement | null} */ (document.getElementById(SCRIPT_ID));
    if (!script) {
      script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = SCRIPT_URL;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    const loaded = () => resolve(window.turnstile);
    const failed = () => reject(new Error("Turnstile failed to load."));
    script.addEventListener("load", loaded, { once: true });
    script.addEventListener("error", failed, { once: true });

    if (window.turnstile) loaded();
  });
}

export default function TurnstileWidget({ siteKey, resetKey, onToken, onError }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined;

    let disposed = false;
    let widgetId;
    loadTurnstile()
      .then((turnstile) => {
        if (disposed || !turnstile || !containerRef.current) return;
        widgetId = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action: "contact_enquiry",
          theme: "auto",
          callback: onToken,
          "expired-callback": () => onToken(""),
          "timeout-callback": () => onToken(""),
          "error-callback": () => {
            onToken("");
            onError?.();
          },
        });
      })
      .catch(() => onError?.());

    return () => {
      disposed = true;
      if (widgetId !== undefined && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, resetKey, onToken, onError]);

  return <div ref={containerRef} aria-label="Spam protection verification" />;
}
