"use client";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, MapPin, TrendingUp } from "lucide-react";
import { experience, type Experience as Exp } from "@/content/experience";
import { Reveal } from "./Reveal";
import { Rich } from "./Rich";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title={<>Where I&apos;ve <em>worked</em></>}
      lead="Public health technology, cloud-hosted non-profit platforms and product engineering. Select a role to see the full detail."
      tone="surface"
    >
      <ol className="relative space-y-6 before:absolute before:bottom-4 before:left-[7px] before:top-4 before:w-px before:bg-line/10 sm:before:left-[9px]">
        {experience.map((job, i) => (
          <Reveal key={job.company} delay={i * 0.05}>
            <li className="relative pl-8 sm:pl-12">
              <span
                aria-hidden="true"
                className={`absolute left-0 top-8 h-[15px] w-[15px] rounded-full ring-4 ring-surface sm:h-[19px] sm:w-[19px] ${
                  job.end === "Present" ? "bg-accent" : "bg-fg/25"
                }`}
              />
              <ExperienceCard job={job} defaultOpen={i === 0} />
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

function ExperienceCard({ job, defaultOpen }: { job: Exp; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = `exp-${job.company.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <article className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-start justify-between gap-4 p-6 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent sm:p-8"
      >
        <div className="min-w-0">
          <p className="text-sm text-muted">
            <time>{job.start}</time> – <time>{job.end}</time>
          </p>
          <h3 className="mt-1.5 text-xl font-semibold tracking-tight sm:text-2xl">{job.role}</h3>
          <p className="mt-1 text-[15px] text-fg/80">{job.company}</p>
          {job.location && (
            <p className="mt-1 flex items-center gap-1 text-sm text-muted">
              <MapPin size={13} aria-hidden="true" /> {job.location}
            </p>
          )}
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-muted">{job.summary}</p>
        </div>
        <span className="mt-1 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-surface ring-1 ring-line/[0.06]">
          <ChevronDown size={18} aria-hidden="true" className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          <span className="sr-only">{open ? "Hide details" : "Show details"}</span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 border-t border-line/[0.06] p-6 sm:p-8 lg:grid-cols-[1.6fr_1fr]">
              <div>
                <h4 className="eyebrow">Key responsibilities</h4>
                <ul className="mt-4 space-y-3">
                  {job.responsibilities.map((r) => (
                    <li key={r} className="flex gap-3 text-[15px] leading-relaxed text-fg/85">
                      <span aria-hidden="true" className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-fg/40" />
                      <span><Rich text={r} /></span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-8">
                {job.highlights.length > 0 && (
                  <div>
                    <h4 className="eyebrow">Impact</h4>
                    <ul className="mt-4 space-y-3">
                      {job.highlights.map((h) => (
                        <li key={h} className="flex gap-3 rounded-2xl bg-surface p-4 text-sm leading-relaxed">
                          <TrendingUp size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-accent" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h4 className="eyebrow">Tools</h4>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {job.tools.map((t) => (
                      <li key={t} className="chip">{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  );
}
