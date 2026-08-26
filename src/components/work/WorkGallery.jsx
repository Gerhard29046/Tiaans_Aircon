import React, { useState } from "react";
import ProjectCard from "@/components/work/ProjectCard";
import ProjectDrawer from "@/components/work/ProjectDrawer";
import Reveal from "@/components/site/Reveal";

const FILTERS = ["All", "Installations", "Repairs", "Servicing", "Car Aircon"];
const MAP = { Installations: "Installation", Repairs: "Repair", Servicing: "Service", "Car Aircon": "Car Aircon" };

/** @param {{projects?: Array<Record<string, any>>, limit?: number}} props */
export default function WorkGallery({ projects = [], limit }) {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState(null);

  let list = filter === "All" ? projects : projects.filter((p) => p.category === MAP[filter]);
  if (limit) list = list.slice(0, limit);

  if (projects.length === 0) {
    return (
      <div className="mt-12 p-10 rounded-3xl border border-dashed border-[#0A2948]/15 bg-[#F2F8FC] text-center">
        <p className="text-[#0A2948]/60">
          Tiaan's completed projects will appear here as soon as they're added.
        </p>
      </div>
    );
  }

  return (
    <>
      {!limit && (
        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-[#0A2948] text-white"
                  : "bg-[#F2F8FC] text-[#0A2948]/70 hover:bg-[#e2eef8]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      )}

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.07}>
            <ProjectCard project={p} onClick={() => setActive(p)} />
          </Reveal>
        ))}
      </div>

      {list.length === 0 && <p className="mt-8 text-[#0A2948]/50">No projects in this category yet.</p>}

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </>
  );
}
