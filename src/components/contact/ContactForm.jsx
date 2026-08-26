import React, { useCallback, useState } from "react";
import { Loader2, Upload, CheckCircle2, MessageCircle } from "lucide-react";
import { publicApi } from "@/api/public";
import { waLink } from "@/lib/brand";
import TurnstileWidget from "./TurnstileWidget";

const SERVICES = [
  "New Aircon Installation",
  "Aircon Sales",
  "Aircon Repair",
  "Aircon Service",
  "Car Aircon Regas",
  "Car Aircon Repair",
  "Other",
];
const TYPES = ["Home", "Business", "Vehicle"];
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY?.trim();

const inputCls =
  "w-full px-4 py-3.5 rounded-2xl border border-[#0A2948]/15 bg-white text-[#0A2948] placeholder:text-[#0A2948]/35 focus:outline-none focus:ring-2 focus:ring-[#2D8CCB] focus:border-transparent";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    service: SERVICES[0],
    customer_type: "Home",
    message: "",
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  const handleTurnstileToken = useCallback((token) => setTurnstileToken(token), []);
  const handleTurnstileError = useCallback(() => {
    setError("The spam protection check could not load. Please refresh the page or WhatsApp Tiaan instead.");
  }, []);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (!TURNSTILE_SITE_KEY || !turnstileToken) {
      setError("Please complete the spam protection check before sending your enquiry.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await publicApi.submitEnquiry(form, file, turnstileToken);
      setDone(true);
    } catch {
      setError("Something went wrong sending your enquiry. Please WhatsApp or call Tiaan instead.");
      setTurnstileToken("");
      setTurnstileResetKey((key) => key + 1);
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="p-8 sm:p-10 rounded-[2rem] bg-[#F2F8FC] border border-[#2D8CCB]/25 text-center">
        <CheckCircle2 className="w-12 h-12 mx-auto text-[#2D8CCB]" />
        <h3 className="mt-5 font-heading font-extrabold text-2xl text-[#0A2948]">Thanks — got it!</h3>
        <p className="mt-3 text-[#0A2948]/70">
          Tiaan has your enquiry and will get back to you as soon as he can. Need it sorted sooner?
        </p>
        <a
          href={waLink("general")}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#2D8CCB] text-white font-bold"
        >
          <MessageCircle className="w-5 h-5" /> WhatsApp Tiaan now
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-[#0A2948] mb-2">Your Name</label>
          <input id="name" required value={form.name} onChange={set("name")} className={inputCls} placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-[#0A2948] mb-2">Phone Number</label>
          <input id="phone" required type="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder="082 000 0000" />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-semibold text-[#0A2948] mb-2">Email (optional)</label>
        <input id="email" type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@email.com" />
      </div>

      <div>
        <label htmlFor="service" className="block text-sm font-semibold text-[#0A2948] mb-2">What do you need help with?</label>
        <select id="service" value={form.service} onChange={set("service")} className={inputCls}>
          {SERVICES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <fieldset>
        <legend className="block text-sm font-semibold text-[#0A2948] mb-2">Is this for a:</legend>
        <div className="flex flex-wrap gap-2">
          {TYPES.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setForm({ ...form, customer_type: t })}
              className={`px-5 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                form.customer_type === t ? "bg-[#0A2948] text-white" : "bg-[#F2F8FC] text-[#0A2948]/70 hover:bg-[#e2eef8]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </fieldset>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-[#0A2948] mb-2">Tell Tiaan what's happening</label>
        <textarea id="message" rows={5} value={form.message} onChange={set("message")} className={inputCls} placeholder="Describe the problem, the unit or the vehicle..." />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#0A2948] mb-2">Upload a Photo (optional)</label>
        <label className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-dashed border-[#0A2948]/25 cursor-pointer hover:border-[#2D8CCB] transition-colors">
          <Upload className="w-5 h-5 text-[#2D8CCB]" />
          <span className="text-sm text-[#0A2948]/70">{file ? file.name : "Photo of your aircon, error display or vehicle"}</span>
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] || null)} />
        </label>
      </div>

      {TURNSTILE_SITE_KEY ? (
        <TurnstileWidget
          siteKey={TURNSTILE_SITE_KEY}
          resetKey={turnstileResetKey}
          onToken={handleTurnstileToken}
          onError={handleTurnstileError}
        />
      ) : (
        <p className="text-sm font-semibold text-[#C8102E]">Enquiry verification is temporarily unavailable.</p>
      )}

      {error && <p className="text-sm font-semibold text-[#C8102E]">{error}</p>}

      <button
        type="submit"
        disabled={busy || !TURNSTILE_SITE_KEY || !turnstileToken}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-9 py-4 rounded-full bg-[#2D8CCB] text-white font-bold hover:bg-[#174A7E] disabled:opacity-60 transition-colors"
      >
        {busy && <Loader2 className="w-5 h-5 animate-spin" />} Send Enquiry
      </button>
    </form>
  );
}
