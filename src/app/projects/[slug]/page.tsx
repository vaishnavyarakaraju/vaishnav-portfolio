import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import { Diagram } from "@/components/Diagram";
import { Footer } from "@/components/Footer";
import { GitHubIcon } from "@/components/BrandIcons";
import { Nav } from "@/components/Nav";
import { Reveal } from "@/components/Reveal";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.overview,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: p.title, description: p.overview, type: "article" },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === slug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <>
      <Nav onHome={false} />
      <main id="main" className="pb-24 pt-32 sm:pt-40">
        <article className="container-x">
          <Link href="/#projects" className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-fg">
            <ArrowLeft size={15} aria-hidden="true" /> All projects
          </Link>
          <Reveal>
            <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-full bg-accent/10 px-3 py-1 font-medium text-accent">{p.category}</span>
              <span className="text-muted">{p.source}</span>
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tightest sm:text-6xl" style={{ textWrap: "balance" }}>{p.title}</h1>
            <p className="lead mt-5 max-w-3xl">{p.overview}</p>
            {(p.github || p.demo) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer" className="btn-secondary"><GitHubIcon /> Source code</a>}
                {p.demo && <a href={p.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">Live demo <ExternalLink size={15} aria-hidden="true" /></a>}
              </div>
            )}
          </Reveal>

          <Reveal className="mt-14">
            <Diagram kind={p.diagram} />
            <p className="mt-3 text-center text-xs text-muted">Architecture overview</p>
          </Reveal>

          <div className="mt-20 grid gap-16 lg:grid-cols-[1fr_20rem]">
            <div className="space-y-16">
              <Block title="The problem"><p className="text-lg leading-relaxed text-fg/85">{p.problem}</p></Block>
              <Block title="Technical architecture">
                <ol className="space-y-4">
                  {p.architecture.map((a, i) => (
                    <li key={a.label} className="card flex gap-5 p-5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface font-mono text-sm text-muted ring-1 ring-line/[0.06]">{i + 1}</span>
                      <div>
                        <h3 className="font-semibold">{a.label}</h3>
                        <p className="mt-1 text-[15px] leading-relaxed text-muted">{a.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </Block>
              <Block title="My contribution">
                <ul className="space-y-3">
                  {p.contribution.map((c) => (
                    <li key={c} className="flex gap-3 text-[17px] leading-relaxed text-fg/85">
                      <span aria-hidden="true" className="mt-3 h-1 w-1 shrink-0 rounded-full bg-fg/40" />{c}
                    </li>
                  ))}
                </ul>
              </Block>
              {p.screenshots && p.screenshots.length > 0 && (
                <Block title="Screenshots">
                  <div className="grid gap-4 sm:grid-cols-2">
                    {p.screenshots.map((s) => (
                      <div key={s.src} className="relative aspect-video overflow-hidden rounded-2xl ring-1 ring-line/[0.08]">
                        <Image src={s.src} alt={s.alt} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
                      </div>
                    ))}
                  </div>
                </Block>
              )}
            </div>

            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <div className="card p-6">
                <h2 className="eyebrow">Results</h2>
                <ul className="mt-4 space-y-3">
                  {p.results.map((r) => (
                    <li key={r} className="flex gap-2.5 text-[15px] leading-snug">
                      <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />{r}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card p-6">
                <h2 className="eyebrow">Technologies</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {p.technologies.map((t) => <li key={t} className="chip">{t}</li>)}
                </ul>
              </div>
            </aside>
          </div>

          <Link href={`/projects/${next.slug}`} className="card group mt-24 flex items-center justify-between gap-6 p-8 transition hover:-translate-y-0.5">
            <div>
              <p className="eyebrow">Next project</p>
              <p className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{next.title}</p>
            </div>
            <ArrowRight size={22} aria-hidden="true" className="shrink-0 transition-transform group-hover:translate-x-1" />
          </Link>
        </article>
      </main>
      <Footer />
    </>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Reveal>
      <section>
        <h2 className="mb-6 text-2xl font-semibold tracking-tight">{title}</h2>
        {children}
      </section>
    </Reveal>
  );
}
