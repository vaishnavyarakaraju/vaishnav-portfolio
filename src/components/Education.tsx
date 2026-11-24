import { CalendarDays, GraduationCap, MapPin } from "lucide-react";
import { education } from "@/content/education";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Education() {
  return (
    <Section id="education" eyebrow="Education" title={<><em>Education</em></>} tone="surface">
      <div className="grid gap-5">
        {education.map((e) => (
          <Reveal key={e.institution}>
            <article className="card relative overflow-hidden p-8 sm:p-12">
              <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgb(var(--accent)/0.12),transparent_65%)]" />
              <div className="relative grid gap-10 md:grid-cols-[auto_1fr] md:items-start">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-surface ring-1 ring-line/[0.06]">
                  <GraduationCap size={30} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-3xl font-semibold tracking-tightest sm:text-4xl">{e.institution}</h3>
                  <p className="mt-3 text-lg text-fg/85">{e.degree}</p>
                  {e.concentration && <p className="mt-1 text-muted">Concentration: {e.concentration}</p>}
                  <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                    <span className="flex items-center gap-1.5"><CalendarDays size={15} aria-hidden="true" /> {e.start} – {e.end}</span>
                    <span className="flex items-center gap-1.5"><MapPin size={15} aria-hidden="true" /> {e.location}</span>
                  </div>
                  {e.coursework && e.coursework.length > 0 && (
                    <div className="mt-8">
                      <h4 className="eyebrow">Relevant coursework</h4>
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {e.coursework.map((c) => <li key={c} className="chip">{c}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
