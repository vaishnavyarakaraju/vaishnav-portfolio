import type { ReactNode } from "react";
import { navItems } from "@/content/site";
import { Reveal } from "./Reveal";

type Props = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  children: ReactNode;
  tone?: "default" | "surface";
};

/** Editorial section header: index number + label on a rule, then the title. */
export function Section({ id, eyebrow, title, lead, children, tone = "default" }: Props) {
  const index = navItems.findIndex((n) => n.id === id);
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`py-24 sm:py-32 ${tone === "surface" ? "bg-surface" : ""}`}>
      <div className="container-x">
        <Reveal>
          <div className="flex items-center gap-4 border-t border-line/15 pt-4 font-mono text-xs text-muted">
            {index > 0 && <span>{String(index).padStart(2, "0")}</span>}
            <span className="uppercase tracking-[0.14em]">{eyebrow}</span>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <h2 id={`${id}-title`} className="h-section">{title}</h2>
            {lead && <p className="lead max-w-xl lg:justify-self-end">{lead}</p>}
          </div>
        </Reveal>
        <div className="mt-14 sm:mt-16">{children}</div>
      </div>
    </section>
  );
}
