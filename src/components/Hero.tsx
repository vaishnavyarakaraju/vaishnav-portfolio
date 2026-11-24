"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";
import { experience } from "@/content/experience";
import { education } from "@/content/education";
import { site } from "@/content/site";
import { SocialButtons } from "./SocialButtons";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const [current, ...previous] = experience;
  return (
    <section id="home" aria-labelledby="home-title" className="relative pt-32 pb-20 sm:pt-44 sm:pb-28">
      <div className="container-x">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line/15 pt-4 font-mono text-xs uppercase tracking-[0.14em] text-muted"
        >
          <span className="text-fg">{site.fullName}</span>
          <span>{site.headline}</span>
          <span className="hidden sm:inline">{site.location}</span>
        </motion.p>

        <div className="mt-12 grid gap-14 lg:grid-cols-[1.8fr_1fr] lg:items-end lg:gap-16">
          <div>
            <h1 id="home-title" className="text-[2.9rem] font-semibold leading-[1.02] tracking-tightest sm:text-6xl lg:text-[3.5rem] xl:text-[3.9rem]">
              {site.heroTitle.map((line, i) => (
                <motion.span
                  key={line}
                  className="block"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.1 + i * 0.12, ease }}
                >
                  {i === site.heroTitle.length - 1 && line.includes(" ") ? (<>{line.slice(0, line.lastIndexOf(" ") + 1)}<em>{line.slice(line.lastIndexOf(" ") + 1)}</em></>) : line}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease }}
              className="lead mt-8 max-w-xl"
            >
              {site.heroDescription}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="mt-6 max-w-xl font-mono text-[13px] leading-relaxed text-muted"
            >
              {site.disciplines.join("  /  ")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7, ease }}
              className="mt-10 flex flex-wrap gap-3"
            >
              <a href="#projects" className="btn-primary">
                Explore My Work <ArrowDown size={15} aria-hidden="true" />
              </a>
              <a href={site.resume} download className="btn-secondary">
                <Download size={15} aria-hidden="true" /> Download Resume
              </a>
              <SocialButtons />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease }}
          >
            {site.portrait ? (
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface ring-1 ring-line/[0.08]">
                <Image src={site.portrait} alt={`Portrait of ${site.name}`} fill priority sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
              </div>
            ) : (
              <aside aria-label="At a glance" className="rounded-[1.75rem] bg-surface p-7 ring-1 ring-line/[0.07] sm:p-8">
                <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 motion-reduce:animate-none" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                  </span>
                  Currently
                </p>
                {current && (
                  <>
                    <p className="mt-4 text-xl font-semibold leading-snug tracking-tight">{current.role}</p>
                    <p className="mt-1 text-[15px] text-fg/75">{current.company}</p>
                  </>
                )}

                <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-muted">Previously</p>
                <ul className="mt-3 space-y-2.5">
                  {previous.map((p) => (
                    <li key={p.company} className="text-[15px] leading-snug">
                      {p.role} <span className="text-muted">at {p.company}</span>
                    </li>
                  ))}
                </ul>

                {education[0] && (
                  <>
                    <p className="mt-8 font-mono text-xs uppercase tracking-[0.14em] text-muted">Studied</p>
                    <p className="mt-3 text-[15px] leading-snug">
                      {education[0].degree} <span className="text-muted">at {education[0].institution}</span>
                    </p>
                  </>
                )}
              </aside>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
