import Image from "next/image";
import { Cloud, Cpu, Database, GitBranch, Network, Sparkles, BookOpen, type LucideIcon } from "lucide-react";
import { aboutParagraphs, interests } from "@/content/about";
import { site } from "@/content/site";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

const interestIcons: LucideIcon[] = [Cpu, Cloud, Network, Database, GitBranch, Sparkles, BookOpen];

export function About() {
  return (
    <Section id="about" eyebrow="About me" title={<>A little about <em>me</em></>}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr] lg:gap-20">
        <Reveal>
          {site.portrait ? (
            <div className="relative aspect-square overflow-hidden rounded-[2rem] ring-1 ring-line/[0.08]">
              <Image src={site.portrait} alt={`${site.name}`} fill sizes="(min-width: 1024px) 420px, 90vw" className="object-cover" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3" aria-label="Areas of interest">
              {interests.map((label, i) => {
                const I = interestIcons[i % interestIcons.length];
                return (
                  <div key={label} className={`card flex flex-col justify-between p-5 ${i === 0 ? "col-span-2" : ""}`}>
                    <I size={20} strokeWidth={1.6} className="text-accent" aria-hidden="true" />
                    <span className="mt-6 text-[15px] font-medium leading-tight">{label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </Reveal>
        <div className="space-y-6">
          {aboutParagraphs.map((p, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <p className={`leading-relaxed ${i === 0 ? "text-xl text-fg sm:text-2xl sm:leading-snug" : "text-lg text-muted"}`}>{p}</p>
            </Reveal>
          ))}
          {site.portrait && (
            <Reveal>
              <ul className="flex flex-wrap gap-2 pt-2">
                {interests.map((t) => <li key={t} className="chip">{t}</li>)}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </Section>
  );
}
