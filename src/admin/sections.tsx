"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import {
  ArrowDown, ArrowUp, Award, Briefcase, ExternalLink, FolderGit2, GraduationCap, MapPin, Mail, Pencil, Trash2, Check, X,
} from "lucide-react";
import {
  AddButton, BulletsInput, Card, ChipInput, Dialog, IconButton, PairsInput, SelectField, TextField, UploadField,
  fromList, move, slugify, toList, useUploads,
} from "./ui";

type Setter<T> = (next: T) => void;
type Obj = Record<string, any>;

/* ------------------------------------------------------------------ shared list editing */

function useItemEditor<T extends Obj>(items: T[], setItems: Setter<T[]>, blank: () => T, prepend = false) {
  const [state, setState] = useState<{ index: number | null; draft: T } | null>(null);
  return {
    open: !!state,
    draft: state?.draft,
    isNew: state?.index === null,
    set: (patch: Partial<T>) => setState((s) => (s ? { ...s, draft: { ...s.draft, ...patch } } : s)),
    edit: (index: number) => setState({ index, draft: structuredClone(items[index]) }),
    add: () => setState({ index: null, draft: blank() }),
    close: () => setState(null),
    save: (transform?: (draft: T) => T) => {
      if (!state) return;
      const draft = transform ? transform(state.draft) : state.draft;
      if (state.index === null) setItems(prepend ? [draft, ...items] : [...items, draft]);
      else setItems(items.map((it, i) => (i === state.index ? draft : it)));
      setState(null);
    },
    remove: () => {
      if (!state || state.index === null) return setState(null);
      if (!confirm("Delete this item? You can still cancel by not publishing.")) return;
      setItems(items.filter((_, i) => i !== state.index));
      setState(null);
    },
  };
}

function RowActions({ i, n, onEdit, onMove, label }: { i: number; n: number; onEdit: () => void; onMove: (to: number) => void; label: string }) {
  return (
    <div className="flex shrink-0 items-center">
      <span className="hidden sm:flex">
        <IconButton label="Move up" onClick={() => onMove(i - 1)} disabled={i === 0}><ArrowUp size={16} /></IconButton>
        <IconButton label="Move down" onClick={() => onMove(i + 1)} disabled={i === n - 1}><ArrowDown size={16} /></IconButton>
      </span>
      <IconButton label={`Edit ${label}`} onClick={onEdit}><Pencil size={17} /></IconButton>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="rounded-2xl border border-dashed border-line/15 px-5 py-6 text-center text-sm text-muted">{children}</p>;
}

const iconOptions = ["Code2", "Server", "Cloud", "Database", "Workflow", "Activity", "Plug", "Layers", "Container", "AppWindow", "ShieldCheck"].map((v) => ({ value: v, label: v }));

/* ------------------------------------------------------------------ intro */

export function IntroSection({ value, set }: { value: Obj; set: Setter<Obj> }) {
  const { preview } = useUploads();
  const [draft, setDraft] = useState<Obj | null>(null);
  const d = draft ?? {};
  const patch = (p: Obj) => setDraft({ ...d, ...p });
  const photo = preview(value.portrait);
  return (
    <section id="intro" className="overflow-hidden rounded-3xl bg-elevated ring-1 ring-line/[0.07]">
      <div className="h-28 bg-gradient-to-br from-fg via-fg/85 to-accent/70 sm:h-36" aria-hidden="true" />
      <div className="px-6 pb-7 sm:px-8">
        <div className="-mt-14 flex items-end justify-between sm:-mt-16">
          <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full bg-surface text-3xl font-semibold ring-4 ring-elevated sm:h-32 sm:w-32">
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photo} alt={value.name} className="h-full w-full object-cover" />
            ) : (
              value.initials
            )}
          </div>
          <button type="button" onClick={() => setDraft(structuredClone(value))} className="btn-secondary mb-1">
            <Pencil size={15} aria-hidden="true" /> Edit intro
          </button>
        </div>
        <h1 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">{value.name}</h1>
        <p className="mt-1 text-lg text-fg/80">{value.headline}</p>
        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1"><MapPin size={14} aria-hidden="true" /> {value.location}</span>
          <span className="inline-flex items-center gap-1"><Mail size={14} aria-hidden="true" /> {value.email}</span>
        </p>
        <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg/80">{value.heroDescription}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {toList(value.disciplines).map((x) => <span key={x} className="chip">{x}</span>)}
        </div>
      </div>

      <Dialog open={!!draft} title="Edit intro" onClose={() => setDraft(null)} onSave={() => { set(d); setDraft(null); }}>
        <UploadField label="Profile photo" value={d.portrait} onChange={(v) => patch({ portrait: v })} hint="Shown on the home page and About section. A square photo works best." />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Name" value={d.name} onChange={(v) => patch({ name: v })} />
          <TextField label="Full legal name" value={d.fullName} onChange={(v) => patch({ fullName: v })} />
          <TextField label="Headline" value={d.headline} onChange={(v) => patch({ headline: v })} placeholder="e.g. Systems Engineer" />
          <TextField label="Location" value={d.location} onChange={(v) => patch({ location: v })} />
        </div>
        <TextField label="Big heading on the home page" hint="One line per row. The last word is shown in italics." multiline rows={3}
          value={(d.heroTitle ?? []).join("\n")} onChange={(v) => patch({ heroTitle: v.split("\n") })} />
        <TextField label="Short introduction" multiline value={d.heroDescription} onChange={(v) => patch({ heroDescription: v })} />
        <ChipInput label="Focus areas" value={toList(d.disciplines)} onChange={(v) => patch({ disciplines: fromList(v) })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Email" type="email" value={d.email} onChange={(v) => patch({ email: v })} />
          <TextField label="LinkedIn link" value={d.linkedin} onChange={(v) => patch({ linkedin: v })} />
          <TextField label="GitHub link" value={d.github} onChange={(v) => patch({ github: v })} />
          <TextField label="Initials (logo)" value={d.initials} onChange={(v) => patch({ initials: v.slice(0, 3) })} />
        </div>
        <UploadField label="Resume (PDF)" kind="pdf" value={d.resume} onChange={(v) => patch({ resume: v })} hint="Visitors download this from the Resume buttons." />
        <TextField label="Website address" value={d.url} onChange={(v) => patch({ url: v })} hint="Only change this if you move to a new domain." />
      </Dialog>
    </section>
  );
}

/* ------------------------------------------------------------------ skills (inline) */

export function SkillsSection({ value, set }: { value: Obj; set: Setter<Obj> }) {
  const groups: Obj[] = value.groups ?? [];
  const setGroups = (g: Obj[]) => set({ ...value, groups: g });
  const [renaming, setRenaming] = useState<number | null>(null);
  const [name, setName] = useState("");
  return (
    <Card id="skills" title="Skills" subtitle="Type a skill and press Enter. Click × to remove one."
      action={<AddButton onClick={() => { setGroups([...groups, { title: "New group", icon: "Code2", skills: "" }]); setRenaming(groups.length); setName("New group"); }}>Add group</AddButton>}>
      <div className="space-y-5">
        {groups.map((g, i) => (
          <div key={i} className="rounded-2xl bg-surface/60 p-4 ring-1 ring-line/[0.06]">
            <div className="mb-3 flex items-center justify-between gap-2">
              {renaming === i ? (
                <form className="flex flex-1 items-center gap-1" onSubmit={(e) => { e.preventDefault(); setGroups(groups.map((x, j) => (j === i ? { ...x, title: name.trim() || x.title } : x))); setRenaming(null); }}>
                  <input autoFocus value={name} onChange={(e) => setName(e.target.value)} aria-label="Group name" className="w-full rounded-lg bg-elevated px-3 py-1.5 text-[15px] font-semibold ring-1 ring-accent focus:outline-none" />
                  <IconButton label="Save name" onClick={() => { setGroups(groups.map((x, j) => (j === i ? { ...x, title: name.trim() || x.title } : x))); setRenaming(null); }}><Check size={17} /></IconButton>
                  <IconButton label="Cancel" onClick={() => setRenaming(null)}><X size={17} /></IconButton>
                </form>
              ) : (
                <button type="button" onClick={() => { setRenaming(i); setName(g.title); }} className="group inline-flex items-center gap-2 text-[15px] font-semibold" title="Rename group">
                  {g.title} <Pencil size={13} className="text-muted opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
                </button>
              )}
              <div className="flex items-center">
                <IconButton label="Move group up" onClick={() => setGroups(move(groups, i, i - 1))} disabled={i === 0}><ArrowUp size={15} /></IconButton>
                <IconButton label="Move group down" onClick={() => setGroups(move(groups, i, i + 1))} disabled={i === groups.length - 1}><ArrowDown size={15} /></IconButton>
                <IconButton label={`Delete ${g.title}`} tone="danger" onClick={() => confirm(`Delete the "${g.title}" group?`) && setGroups(groups.filter((_, j) => j !== i))}><Trash2 size={15} /></IconButton>
              </div>
            </div>
            <ChipInput value={toList(g.skills)} onChange={(v) => setGroups(groups.map((x, j) => (j === i ? { ...x, skills: fromList(v) } : x)))} placeholder="Add a skill and press Enter" />
          </div>
        ))}
        {!groups.length && <Empty>No skill groups yet.</Empty>}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ experience */

export function ExperienceSection({ value, set }: { value: Obj; set: Setter<Obj> }) {
  const jobs: Obj[] = value.jobs ?? [];
  const setJobs = (j: Obj[]) => set({ ...value, jobs: j });
  const ed = useItemEditor(jobs, setJobs, () => ({ company: "", role: "", location: "", start: "", end: "Present", summary: "", highlights: [], responsibilities: [""], tools: "" }), true);
  const d = ed.draft ?? {};
  return (
    <Card id="experience" title="Experience" subtitle="Newest first. New roles are added at the top." action={<AddButton onClick={ed.add}>Add role</AddButton>}>
      <ul className="divide-y divide-line/[0.07]">
        {jobs.map((j, i) => (
          <li key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface ring-1 ring-line/[0.06]"><Briefcase size={20} className="text-muted" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{j.role || "Untitled role"}</p>
              <p className="text-[15px] text-fg/80">{j.company}</p>
              <p className="text-sm text-muted">{j.start} – {j.end}{j.location ? ` · ${j.location}` : ""}</p>
              {j.summary && <p className="mt-2 line-clamp-2 text-sm text-fg/75">{j.summary}</p>}
            </div>
            <RowActions i={i} n={jobs.length} label={j.role} onEdit={() => ed.edit(i)} onMove={(to) => setJobs(move(jobs, i, to))} />
          </li>
        ))}
        {!jobs.length && <Empty>No roles yet.</Empty>}
      </ul>

      <Dialog open={ed.open} title={ed.isNew ? "Add role" : "Edit role"} onClose={ed.close} onSave={() => ed.save()} onDelete={ed.isNew ? undefined : ed.remove}>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Job title" value={d.role} onChange={(v) => ed.set({ role: v })} />
          <TextField label="Company" value={d.company} onChange={(v) => ed.set({ company: v })} />
          <TextField label="Start" placeholder="e.g. Jan 2026" value={d.start} onChange={(v) => ed.set({ start: v })} />
          <TextField label="End" placeholder="e.g. Present" value={d.end} onChange={(v) => ed.set({ end: v })} />
        </div>
        <TextField label="Location" value={d.location} onChange={(v) => ed.set({ location: v })} />
        <TextField label="One-line summary" multiline rows={2} value={d.summary} onChange={(v) => ed.set({ summary: v })} />
        <BulletsInput label="Key responsibilities" value={d.responsibilities ?? []} onChange={(v) => ed.set({ responsibilities: v })} addLabel="Add responsibility" />
        <BulletsInput label="Impact highlights" hint="Measurable results. Shown in the Impact box." value={d.highlights ?? []} onChange={(v) => ed.set({ highlights: v })} addLabel="Add highlight" />
        <ChipInput label="Tools" value={toList(d.tools)} onChange={(v) => ed.set({ tools: fromList(v) })} />
      </Dialog>
    </Card>
  );
}

/* ------------------------------------------------------------------ projects */

const diagramOptions = [
  { value: "etl", label: "Data pipeline (sources → EventBridge → Lambda → DynamoDB)" },
  { value: "monitoring", label: "Monitoring (workflows → checks → exceptions → reporting)" },
  { value: "deploy", label: "Deployment (release → health checks → validation → live)" },
  { value: "identity", label: "APIs & identity (client → OAuth/OIDC/SAML → API → webhooks)" },
  { value: "reconcile", label: "Automation (resources → Python → SQL Server → SSRS)" },
];

export function ProjectsSection({ value, set }: { value: Obj; set: Setter<Obj> }) {
  const projects: Obj[] = value.projects ?? [];
  const categories = toList(value.categories);
  const setProjects = (p: Obj[]) => set({ ...value, projects: p });
  const ed = useItemEditor(projects, setProjects, () => ({ slug: "", title: "", category: categories[0] ?? "", source: "Project", tagline: "", overview: "", problem: "", architecture: [], technologies: "", contribution: [], results: [], diagram: "etl", github: "", demo: "", screenshots: [] }));
  const d = ed.draft ?? {};
  const save = () =>
    ed.save((draft) => {
      if (draft.slug && !ed.isNew) return draft;
      const taken = projects.map((p) => p.slug);
      const base = slugify(draft.title || "project");
      let slug = base;
      let n = 2;
      while (taken.includes(slug)) slug = `${base}-${n++}`;
      return { ...draft, slug };
    });
  return (
    <Card id="projects" title="Projects" subtitle="The first two are shown as large featured cards." action={<AddButton onClick={ed.add}>Add project</AddButton>}>
      <ul className="divide-y divide-line/[0.07]">
        {projects.map((p, i) => (
          <li key={p.slug || i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface ring-1 ring-line/[0.06]"><FolderGit2 size={20} className="text-muted" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{p.title || "Untitled project"} {i < 2 && <span className="ml-1 rounded-full bg-accent/10 px-2 py-0.5 align-middle text-[11px] font-medium text-accent">Featured</span>}</p>
              <p className="text-sm text-muted">{p.category}</p>
              {p.tagline && <p className="mt-1 line-clamp-2 text-sm text-fg/75">{p.tagline}</p>}
            </div>
            <RowActions i={i} n={projects.length} label={p.title} onEdit={() => ed.edit(i)} onMove={(to) => setProjects(move(projects, i, to))} />
          </li>
        ))}
        {!projects.length && <Empty>No projects yet.</Empty>}
      </ul>
      <div className="mt-6 border-t border-line/[0.07] pt-5">
        <ChipInput label="Project categories" hint="These become the filter buttons above the projects." value={categories} onChange={(v) => set({ ...value, categories: fromList(v) })} />
      </div>

      <Dialog open={ed.open} title={ed.isNew ? "Add project" : "Edit project"} onClose={ed.close} onSave={save} onDelete={ed.isNew ? undefined : ed.remove}>
        <TextField label="Project title" value={d.title} onChange={(v) => ed.set({ title: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField label="Category" value={d.category} onChange={(v) => ed.set({ category: v })} options={(categories.includes(d.category) || !d.category ? categories : [d.category, ...categories]).map((c) => ({ value: c, label: c }))} />
          <TextField label="Source" placeholder="Project, or Work at Company" value={d.source} onChange={(v) => ed.set({ source: v })} />
        </div>
        <TextField label="Tagline" placeholder="One short sentence" value={d.tagline} onChange={(v) => ed.set({ tagline: v })} />
        <TextField label="Overview" multiline rows={3} value={d.overview} onChange={(v) => ed.set({ overview: v })} />
        <TextField label="The problem" multiline rows={3} value={d.problem} onChange={(v) => ed.set({ problem: v })} />
        <PairsInput label="How it works (architecture steps)" addLabel="Add step" value={d.architecture ?? []} onChange={(v) => ed.set({ architecture: v })}
          fields={[{ key: "label", label: "Step name" }, { key: "detail", label: "What happens", multiline: true }]} />
        <ChipInput label="Technologies" value={toList(d.technologies)} onChange={(v) => ed.set({ technologies: fromList(v) })} />
        <BulletsInput label="My contribution" value={d.contribution ?? []} onChange={(v) => ed.set({ contribution: v })} />
        <BulletsInput label="Results" value={d.results ?? []} onChange={(v) => ed.set({ results: v })} addLabel="Add result" />
        <SelectField label="Diagram" value={d.diagram} onChange={(v) => ed.set({ diagram: v })} options={diagramOptions} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="GitHub link (optional)" value={d.github} onChange={(v) => ed.set({ github: v })} />
          <TextField label="Live demo link (optional)" value={d.demo} onChange={(v) => ed.set({ demo: v })} />
        </div>
        <ScreenshotsInput value={d.screenshots ?? []} onChange={(v) => ed.set({ screenshots: v })} />
        {!ed.isNew && <p className="text-xs text-muted">Page address: /projects/{d.slug}</p>}
      </Dialog>
    </Card>
  );
}

function ScreenshotsInput({ value, onChange }: { value: Obj[]; onChange: (v: Obj[]) => void }) {
  return (
    <div className="space-y-3">
      {value.map((s, i) => (
        <div key={i} className="rounded-2xl bg-surface/60 p-3 ring-1 ring-line/[0.06]">
          <UploadField label={`Screenshot ${i + 1}`} value={s.src} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, src: v } : x)))} />
          <div className="mt-3 flex items-end gap-2">
            <div className="flex-1"><TextField label="Describe it (for accessibility)" value={s.alt} onChange={(v) => onChange(value.map((x, j) => (j === i ? { ...x, alt: v } : x)))} /></div>
            <IconButton label="Remove screenshot" tone="danger" onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash2 size={16} /></IconButton>
          </div>
        </div>
      ))}
      <AddButton onClick={() => onChange([...value, { src: "", alt: "" }])}>Add screenshot</AddButton>
    </div>
  );
}

/* ------------------------------------------------------------------ certifications */

export function CertificationsSection({ value, set }: { value: Obj; set: Setter<Obj> }) {
  const { preview } = useUploads();
  const items: Obj[] = value.items ?? [];
  const setItems = (x: Obj[]) => set({ ...value, items: x });
  const ed = useItemEditor(items, setItems, () => ({ title: "", issuer: "", issued: "", expires: "", credentialId: "", verifyUrl: "", image: "", badge: "", pdf: "" }));
  const d = ed.draft ?? {};
  return (
    <Card id="certifications" title="Licenses & certifications" subtitle="The first one is featured with a large certificate display." action={<AddButton onClick={ed.add}>Add certification</AddButton>}>
      <ul className="divide-y divide-line/[0.07]">
        {items.map((c, i) => {
          const img = preview(c.badge || c.image);
          return (
            <li key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
              <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface ring-1 ring-line/[0.06]">
                {img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={img} alt="" className="h-full w-full object-contain" />
                ) : <Award size={20} className="text-muted" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{c.title || "Untitled certification"}</p>
                <p className="text-[15px] text-fg/80">{c.issuer}</p>
                {(c.issued || c.expires) && <p className="text-sm text-muted">{c.issued && `Issued ${c.issued}`}{c.expires && ` · Expires ${c.expires}`}</p>}
                {c.verifyUrl && <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-accent hover:underline">Show credential <ExternalLink size={12} aria-hidden="true" /></a>}
              </div>
              <RowActions i={i} n={items.length} label={c.title} onEdit={() => ed.edit(i)} onMove={(to) => setItems(move(items, i, to))} />
            </li>
          );
        })}
        {!items.length && <Empty>No certifications yet.</Empty>}
      </ul>

      <Dialog open={ed.open} title={ed.isNew ? "Add certification" : "Edit certification"} onClose={ed.close} onSave={() => ed.save()} onDelete={ed.isNew ? undefined : ed.remove}>
        <TextField label="Name" placeholder="e.g. AWS Certified Solutions Architect – Associate" value={d.title} onChange={(v) => ed.set({ title: v })} />
        <TextField label="Issuing organization" value={d.issuer} onChange={(v) => ed.set({ issuer: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Issue date" placeholder="e.g. May 21, 2025" value={d.issued} onChange={(v) => ed.set({ issued: v })} />
          <TextField label="Expiration date" placeholder="Leave empty if none" value={d.expires} onChange={(v) => ed.set({ expires: v })} />
          <TextField label="Credential ID" value={d.credentialId} onChange={(v) => ed.set({ credentialId: v })} />
          <TextField label="Credential URL" placeholder="Credly or verification link" value={d.verifyUrl} onChange={(v) => ed.set({ verifyUrl: v })} />
        </div>
        <UploadField label="Certificate image" value={d.image} onChange={(v) => ed.set({ image: v })} hint="A PNG or JPG of the certificate." />
        <UploadField label="Badge image (optional)" value={d.badge} onChange={(v) => ed.set({ badge: v })} />
        <UploadField label="Certificate PDF (optional)" kind="pdf" value={d.pdf} onChange={(v) => ed.set({ pdf: v })} />
      </Dialog>
    </Card>
  );
}

/* ------------------------------------------------------------------ education */

export function EducationSection({ value, set }: { value: Obj; set: Setter<Obj> }) {
  const items: Obj[] = value.items ?? [];
  const setItems = (x: Obj[]) => set({ ...value, items: x });
  const ed = useItemEditor(items, setItems, () => ({ institution: "", location: "", degree: "", concentration: "", start: "", end: "", coursework: "" }), true);
  const d = ed.draft ?? {};
  return (
    <Card id="education" title="Education" action={<AddButton onClick={ed.add}>Add education</AddButton>}>
      <ul className="divide-y divide-line/[0.07]">
        {items.map((e, i) => (
          <li key={i} className="flex items-start gap-4 py-4 first:pt-0 last:pb-0">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-surface ring-1 ring-line/[0.06]"><GraduationCap size={20} className="text-muted" aria-hidden="true" /></span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{e.institution}</p>
              <p className="text-[15px] text-fg/80">{e.degree}{e.concentration ? `, ${e.concentration}` : ""}</p>
              <p className="text-sm text-muted">{e.start} – {e.end}</p>
            </div>
            <RowActions i={i} n={items.length} label={e.institution} onEdit={() => ed.edit(i)} onMove={(to) => setItems(move(items, i, to))} />
          </li>
        ))}
        {!items.length && <Empty>No education yet.</Empty>}
      </ul>
      <Dialog open={ed.open} title={ed.isNew ? "Add education" : "Edit education"} onClose={ed.close} onSave={() => ed.save()} onDelete={ed.isNew ? undefined : ed.remove}>
        <TextField label="School" value={d.institution} onChange={(v) => ed.set({ institution: v })} />
        <TextField label="Degree" value={d.degree} onChange={(v) => ed.set({ degree: v })} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Concentration" value={d.concentration} onChange={(v) => ed.set({ concentration: v })} />
          <TextField label="Location" value={d.location} onChange={(v) => ed.set({ location: v })} />
          <TextField label="Start" placeholder="e.g. Aug 2023" value={d.start} onChange={(v) => ed.set({ start: v })} />
          <TextField label="End" placeholder="e.g. May 2025" value={d.end} onChange={(v) => ed.set({ end: v })} />
        </div>
        <ChipInput label="Relevant coursework" value={toList(d.coursework)} onChange={(v) => ed.set({ coursework: fromList(v) })} />
      </Dialog>
    </Card>
  );
}

/* ------------------------------------------------------------------ about */

export function AboutSection({ value, set }: { value: Obj; set: Setter<Obj> }) {
  const [draft, setDraft] = useState<Obj | null>(null);
  const d = draft ?? {};
  const paragraphs: string[] = value.paragraphs ?? [];
  return (
    <Card id="about" title="About" action={<IconButton label="Edit about" onClick={() => setDraft({ text: paragraphs.join("\n\n"), interests: toList(value.interests) })}><Pencil size={17} /></IconButton>}>
      <div className="space-y-3 text-[15px] leading-relaxed text-fg/80">
        {paragraphs.map((p, i) => <p key={i} className="line-clamp-3">{p}</p>)}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">{toList(value.interests).map((x) => <span key={x} className="chip">{x}</span>)}</div>
      <Dialog open={!!draft} title="Edit about" onClose={() => setDraft(null)} onSave={() => {
        set({ ...value, paragraphs: String(d.text).split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean), interests: fromList(d.interests) });
        setDraft(null);
      }}>
        <TextField label="About you" hint="Leave an empty line between paragraphs." multiline rows={12} value={d.text} onChange={(v) => setDraft({ ...d, text: v })} />
        <ChipInput label="Interests" value={d.interests ?? []} onChange={(v) => setDraft({ ...d, interests: v })} />
      </Dialog>
    </Card>
  );
}

/* ------------------------------------------------------------------ summary highlights */

export function SummarySection({ value, set }: { value: Obj; set: Setter<Obj> }) {
  const [draft, setDraft] = useState<Obj | null>(null);
  const d = draft ?? {};
  const areas: Obj[] = value.areas ?? [];
  const ed = useItemEditor(areas, (a) => set({ ...value, areas: a }), () => ({ icon: "Code2", title: "", body: "" }));
  const a = ed.draft ?? {};
  return (
    <Card id="summary" title="Summary & highlights" subtitle="The numbers and focus cards near the top of the site."
      action={<IconButton label="Edit summary" onClick={() => setDraft(structuredClone({ intro: value.intro, stats: value.stats ?? [] }))}><Pencil size={17} /></IconButton>}>
      <p className="text-[15px] leading-relaxed text-fg/80">{value.intro}</p>
      <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(value.stats ?? []).map((s: Obj, i: number) => (
          <div key={i} className="rounded-2xl bg-surface p-4">
            <dt className="text-2xl font-semibold tracking-tight">{s.value}</dt>
            <dd className="mt-1 text-xs leading-snug text-muted">{s.label}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-sm font-semibold">Focus cards</h3>
        <AddButton onClick={ed.add}>Add card</AddButton>
      </div>
      <ul className="mt-2 divide-y divide-line/[0.07]">
        {areas.map((ar, i) => (
          <li key={i} className="flex items-center gap-3 py-3">
            <span className="min-w-0 flex-1 truncate text-[15px]">{ar.title}</span>
            <RowActions i={i} n={areas.length} label={ar.title} onEdit={() => ed.edit(i)} onMove={(to) => set({ ...value, areas: move(areas, i, to) })} />
          </li>
        ))}
      </ul>

      <Dialog open={!!draft} title="Edit summary" onClose={() => setDraft(null)} onSave={() => { set({ ...value, ...d }); setDraft(null); }}>
        <TextField label="Intro" multiline value={d.intro} onChange={(v) => setDraft({ ...d, intro: v })} />
        <PairsInput label="Key numbers" addLabel="Add number" value={d.stats ?? []} onChange={(v) => setDraft({ ...d, stats: v })}
          fields={[{ key: "value", label: "Number, e.g. 12,000+" }, { key: "label", label: "What it means" }]} />
      </Dialog>
      <Dialog open={ed.open} title={ed.isNew ? "Add focus card" : "Edit focus card"} onClose={ed.close} onSave={() => ed.save()} onDelete={ed.isNew ? undefined : ed.remove}>
        <TextField label="Title" value={a.title} onChange={(v) => ed.set({ title: v })} />
        <TextField label="Text" multiline value={a.body} onChange={(v) => ed.set({ body: v })} />
        <SelectField label="Icon" value={a.icon} onChange={(v) => ed.set({ icon: v })} options={iconOptions} />
      </Dialog>
    </Card>
  );
}

