import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "@/api/admin";
import Logo from "@/components/brand/logo";
import ProjectsManager from "@/components/admin/ProjectsManager";
import TipsManager from "@/components/admin/TipsManager";
import EnquiriesManager from "@/components/admin/EnquiriesManager";
import ReviewsManager from "@/components/admin/ReviewsManager";

const TABS = ["Enquiries", "Our Work", "Tips", "Reviews"];

export default function Admin() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState("Enquiries");
  const [data, setData] = useState({ projects: [], tips: [], enquiries: [], reviews: [] });

  const load = async () => {
    const [projects, tips, enquiries, reviews] = await Promise.all([
      adminApi.projects.list(),
      adminApi.tips.list(),
      adminApi.enquiries.list(),
      adminApi.reviews.list(),
    ]);
    setData({ projects, tips, enquiries, reviews });
  };

  useEffect(() => {
    (async () => {
      try {
        const session = await adminApi.session();
        setUser(session.user);
        await load();
      } catch (error) {
        setLoadError(error.message || "Admin access could not be verified.");
      } finally {
        setChecking(false);
      }
    })();
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#071c31]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-[#6DD5F7] rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen grid place-items-center bg-[#071c31] px-6 text-center">
        <div>
          <Logo light className="mx-auto" />
          <h1 className="mt-8 font-heading font-extrabold text-3xl text-white">Admin sign in</h1>
          <p className="mt-3 text-white/60">{loadError || "Cloudflare Access is required to manage website content."}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-7 px-7 py-4 rounded-full bg-[#2D8CCB] text-white font-bold"
          >
            Sign in
          </button>
          <Link to="/" className="block mt-6 text-sm text-white/50 hover:text-white">← Back to website</Link>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "New Enquiries", value: data.enquiries.filter((e) => (e.status || "New") === "New").length },
    { label: "Published Projects", value: data.projects.filter((p) => p.published).length },
    { label: "Published Tips", value: data.tips.filter((t) => t.published).length },
    { label: "Reviews", value: data.reviews.length },
  ];

  return (
    <div className="min-h-screen bg-[#071c31] text-white">
      <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 sm:px-8 h-20 bg-[#0A2948]/90 backdrop-blur-xl border-b border-white/10">
        <Logo light />
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-white/60 hover:text-white">View site</Link>
          <button onClick={() => window.location.assign("/cdn-cgi/access/logout")} className="text-sm font-semibold text-[#6DD5F7]">
            Log out
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl">Howzit Tiaan 👋</h1>
        <p className="mt-2 text-white/60">Here's what's happening with your website.</p>

        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="p-5 rounded-3xl bg-white/6 border border-white/12">
              <p className="text-3xl font-heading font-extrabold text-[#6DD5F7]">{s.value}</p>
              <p className="mt-1 text-sm text-white/60">{s.label}</p>
            </div>
          ))}
        </div>

        <nav className="mt-10 flex gap-2 overflow-x-auto pb-1">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-3 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                tab === t ? "bg-[#2D8CCB] text-white" : "bg-white/8 text-white/60 hover:bg-white/15"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>

        <div className="mt-10 pb-20">
          {tab === "Enquiries" && <EnquiriesManager enquiries={data.enquiries} reload={load} />}
          {tab === "Our Work" && <ProjectsManager projects={data.projects} reload={load} />}
          {tab === "Tips" && <TipsManager tips={data.tips} reload={load} />}
          {tab === "Reviews" && <ReviewsManager reviews={data.reviews} reload={load} />}
        </div>
      </div>
    </div>
  );
}
