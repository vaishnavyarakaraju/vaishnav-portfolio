import { summaryAreas, summaryIntro, summaryStats } from "@/content/summary";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Summary() {
  return (
    <Section
      id="summary"
      eyebrow="Summary"
      title={<>What I <em>work on</em></>}
      lead={summaryIntro}
    >
      <Reveal>
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-line/[0.07] ring-1 ring-line/[0.07] lg:grid-cols-4">
          {summaryStats.map((s) => (
            <div key={s.label} className="bg-bg p-6 sm:p-8">
              <dt className="sr-only">{s.label}</dt>
              <dd>
                <span className="block text-4xl font-semibold tracking-tightest sm:text-5xl">{s.value}</span>
                <span className="mt-2 block text-sm leading-snug text-muted">{s.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {summaryAreas.map((a, i) => (
          <Reveal key={a.title} delay={(i % 3) * 0.06} className={i === 0 ? "lg:col-span-2" : ""}>
            <article className="card group h-full p-7 transition-transform duration-300 hover:-translate-y-0.5">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-surface text-fg ring-1 ring-line/[0.06]">
                <Icon name={a.icon} size={20} />
              </span>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{a.title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{a.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
