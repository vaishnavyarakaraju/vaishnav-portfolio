import { skillGroups } from "@/content/skills";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Technical skills"
      title={<>Tools I <em>use</em></>}
      tone="surface"
    >
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {skillGroups.map((g, i) => (
          <Reveal key={g.title} delay={(i % 3) * 0.05}>
            <article className="card p-7">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface ring-1 ring-line/[0.06]">
                  <Icon name={g.icon} size={19} />
                </span>
                <h3 className="text-base font-semibold tracking-tight">{g.title}</h3>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2">
                {g.skills.map((s) => (
                  <li key={s} className="chip">{s}</li>
                ))}
              </ul>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
