"use client";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projectCategories, projects, type Project } from "@/content/projects";
import { Diagram } from "./Diagram";
import { Section } from "./Section";

export function Projects() {
  const [filter, setFilter] = useState<string>("All");
  const filters = ["All", ...projectCategories.filter((c) => projects.some((p) => p.category === c))];
  const shown = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  return (
    <Section
      id="projects"
      eyebrow="Projects & engineering work"
      title={<>Selected <em>work</em></>}
      lead="Pipelines, monitoring and automation built to keep data accurate and services healthy. Open any project for its architecture, my role and the results."
    >
      <div role="group" aria-label="Filter projects by category" className="-mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={`shrink-0 rounded-full px-4 py-2 text-[13px] transition-colors ${
              filter === f ? "bg-fg text-bg" : "bg-surface text-fg/70 ring-1 ring-line/[0.06] hover:text-fg"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <motion.div layout className="grid gap-5 md:grid-cols-2">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.div
              key={p.slug}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className={filter === "All" && i < 2 ? "md:col-span-2" : ""}
            >
              <ProjectCard project={p} featured={filter === "All" && i < 2} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </Section>
  );
}

function ProjectCard({ project: p, featured }: { project: Project; featured: boolean }) {
  return (
    <Link
      href={`/projects/${p.slug}`}
      className="card group relative flex h-full flex-col overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:p-8"
    >
      <div className={featured ? "grid items-center gap-8 lg:grid-cols-[1fr_1.15fr]" : "flex h-full flex-col"}>
        <div className={featured ? "" : "flex-1"}>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full bg-accent/10 px-2.5 py-1 font-medium text-accent">{p.category}</span>
            <span className="text-muted">{p.source}</span>
          </div>
          <h3 className={`mt-4 font-semibold tracking-tight ${featured ? "text-2xl sm:text-3xl" : "text-xl"}`}>{p.title}</h3>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">{p.tagline}</p>
          {featured && <p className="mt-3 text-[15px] leading-relaxed text-fg/80">{p.overview}</p>}
          <ul className="mt-5 flex flex-wrap gap-1.5" aria-label="Technologies">
            {p.technologies.slice(0, featured ? 8 : 4).map((t) => (
              <li key={t} className="chip !text-xs">{t}</li>
            ))}
          </ul>
          <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-accent">
            View project <ArrowUpRight size={15} aria-hidden="true" className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
        <div className={featured ? "" : "mt-6"}>
          <Diagram kind={p.diagram} compact={!featured} />
        </div>
      </div>
    </Link>
  );
}
