import { ArrowUpRight, Download, Mail } from "lucide-react";
import { site } from "@/content/site";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";
import { Reveal } from "./Reveal";

export function Contact() {
  const links = [
    { label: "Email", value: site.email, href: `mailto:${site.email}`, icon: <Mail size={18} aria-hidden="true" /> },
    { label: "LinkedIn", value: "vaishnav-yarakaraju", href: site.linkedin, icon: <LinkedInIcon size={18} />, external: true },
    { label: "GitHub", value: site.github ? site.github.replace(/^https?:\/\//, "") : "Coming soon", href: site.github, icon: <GitHubIcon size={18} />, external: true },
  ];
  return (
    <section id="contact" aria-labelledby="contact-title" className="py-24 sm:py-32">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-fg px-6 py-16 text-bg sm:px-14 sm:py-24">
            <div aria-hidden="true" className="pointer-events-none absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgb(var(--accent)/0.45),transparent_65%)] blur-2xl" />
            <div className="relative">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-bg/60">Contact</p>
              <h2 id="contact-title" className="mt-3 max-w-3xl text-4xl font-semibold tracking-tightest sm:text-6xl">
                Let&apos;s build something reliable together.
              </h2>
              <p className="mt-5 max-w-xl text-lg text-bg/70">
                Open to conversations about software, systems, cloud and data engineering roles. The fastest way to reach me is email.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <a href={`mailto:${site.email}`} className="btn bg-bg text-fg hover:bg-bg/90">
                  <Mail size={16} aria-hidden="true" /> Contact Me
                </a>
                <a href={site.resume} download={site.resumeFileName} className="btn bg-bg/10 text-bg ring-1 ring-bg/20 hover:bg-bg/15">
                  <Download size={16} aria-hidden="true" /> Download Resume
                </a>
              </div>
              <ul className="mt-14 grid gap-3 sm:grid-cols-3">
                {links.map((l) => {
                  const inner = (
                    <>
                      <span className="flex items-center gap-2 text-sm text-bg/60">{l.icon} {l.label}</span>
                      <span className="mt-3 flex items-center justify-between gap-2 break-all text-[15px] font-medium">
                        {l.value}
                        {l.href && <ArrowUpRight size={16} aria-hidden="true" className="shrink-0 opacity-60 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />}
                      </span>
                    </>
                  );
                  return (
                    <li key={l.label}>
                      {l.href ? (
                        <a href={l.href} {...(l.external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group block rounded-2xl bg-bg/[0.06] p-5 ring-1 ring-bg/10 transition hover:bg-bg/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bg">
                          {inner}
                        </a>
                      ) : (
                        <div className="block rounded-2xl bg-bg/[0.04] p-5 opacity-60 ring-1 ring-bg/10">{inner}</div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
