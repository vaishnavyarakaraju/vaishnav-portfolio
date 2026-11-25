"use client";
import { createContext, useContext, useEffect, useId, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, FileText, ImagePlus, Plus, Trash2, Upload, X } from "lucide-react";

/* ------------------------------------------------------------------ uploads */

export type UploadApi = {
  upload: (file: File) => Promise<string>;
  preview: (url?: string) => string | undefined;
};
export const UploadContext = createContext<UploadApi>({ upload: async () => "", preview: (u) => u });
export const useUploads = () => useContext(UploadContext);

/* ------------------------------------------------------------------ list helpers */

export const toList = (v: unknown): string[] =>
  Array.isArray(v) ? v.map(String).map((s) => s.trim()).filter(Boolean)
  : typeof v === "string" ? v.split(",").map((s) => s.trim()).filter(Boolean) : [];
export const fromList = (items: string[]) => items.join(", ");

export function move<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const copy = [...arr];
  const [x] = copy.splice(from, 1);
  copy.splice(to, 0, x);
  return copy;
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60) || "item";

/* ------------------------------------------------------------------ buttons */

export function IconButton({ label, onClick, children, tone = "default", disabled }: {
  label: string; onClick: () => void; children: ReactNode; tone?: "default" | "danger"; disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      disabled={disabled}
      className={`grid h-9 w-9 shrink-0 place-items-center rounded-full transition disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        tone === "danger" ? "text-red-600 hover:bg-red-500/10 dark:text-red-400" : "text-fg/60 hover:bg-line/[0.07] hover:text-fg"
      }`}
    >
      {children}
    </button>
  );
}

export function AddButton({ onClick, children }: { onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium text-accent transition hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Plus size={16} aria-hidden="true" /> {children}
    </button>
  );
}

/* ------------------------------------------------------------------ dialog */

export function Dialog({ open, title, onClose, onSave, onDelete, children, saveLabel = "Done" }: {
  open: boolean; title: string; onClose: () => void; onSave: () => void; onDelete?: () => void;
  children: ReactNode; saveLabel?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const t = setTimeout(() => ref.current?.querySelector<HTMLElement>("input, textarea, select")?.focus(), 50);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onMouseDown={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-elevated shadow-2xl ring-1 ring-line/10 sm:rounded-3xl"
          >
            <div className="flex items-center justify-between border-b border-line/[0.07] px-6 py-4">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <IconButton label="Close" onClick={onClose}><X size={20} /></IconButton>
            </div>
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">{children}</div>
            <div className="flex items-center justify-between gap-3 border-t border-line/[0.07] px-6 py-4">
              {onDelete ? (
                <button type="button" onClick={onDelete} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-500/10 dark:text-red-400">
                  <Trash2 size={16} aria-hidden="true" /> Delete
                </button>
              ) : <span />}
              <div className="flex gap-2">
                <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                <button type="button" onClick={onSave} className="btn-primary">{saveLabel}</button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ form fields */

const inputCls =
  "w-full rounded-xl bg-surface px-4 py-3 text-[15px] text-fg ring-1 ring-line/10 placeholder:text-muted/70 transition focus:bg-elevated focus:outline-none focus:ring-2 focus:ring-accent";

export function Label({ htmlFor, children, hint }: { htmlFor?: string; children: ReactNode; hint?: string }) {
  return (
    <div className="mb-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">{children}</label>
      {hint && <p className="mt-0.5 text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function TextField({ label, value, onChange, hint, placeholder, multiline, rows = 4, type = "text" }: {
  label: string; value?: string; onChange: (v: string) => void; hint?: string; placeholder?: string;
  multiline?: boolean; rows?: number; type?: string;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      {multiline ? (
        <textarea id={id} rows={rows} className={`${inputCls} resize-y leading-relaxed`} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type={type} className={inputCls} value={value ?? ""} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

export function SelectField({ label, value, onChange, options, hint }: {
  label: string; value?: string; onChange: (v: string) => void; options: { value: string; label: string }[]; hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <Label htmlFor={id} hint={hint}>{label}</Label>
      <select id={id} className={`${inputCls} appearance-none`} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

/** Chip editor: type and press Enter (or comma) to add; click × to remove. */
export function ChipInput({ label, value, onChange, hint, placeholder = "Type and press Enter" }: {
  label?: string; value: string[]; onChange: (v: string[]) => void; hint?: string; placeholder?: string;
}) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const add = (raw: string) => {
    const parts = raw.split(",").map((s) => s.trim()).filter(Boolean);
    const next = [...value];
    parts.forEach((p) => { if (!next.some((x) => x.toLowerCase() === p.toLowerCase())) next.push(p); });
    onChange(next);
    setDraft("");
  };
  return (
    <div>
      {label && <Label htmlFor={id} hint={hint}>{label}</Label>}
      <div className="flex flex-wrap items-center gap-2 rounded-xl bg-surface p-2.5 ring-1 ring-line/10 focus-within:ring-2 focus-within:ring-accent">
        {value.map((chip, i) => (
          <span key={chip + i} className="inline-flex items-center gap-1 rounded-full bg-elevated py-1 pl-3 pr-1 text-sm ring-1 ring-line/10">
            {chip}
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`Remove ${chip}`} className="grid h-5 w-5 place-items-center rounded-full text-muted hover:bg-line/10 hover:text-fg">
              <X size={13} />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          placeholder={value.length ? "Add more…" : placeholder}
          onChange={(e) => (e.target.value.endsWith(",") ? add(e.target.value) : setDraft(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === "Enter") { e.preventDefault(); if (draft.trim()) add(draft); }
            if (e.key === "Backspace" && !draft && value.length) onChange(value.slice(0, -1));
          }}
          onBlur={() => draft.trim() && add(draft)}
          className="min-w-[9rem] flex-1 bg-transparent px-1.5 py-1 text-sm outline-none placeholder:text-muted/70"
        />
      </div>
    </div>
  );
}

/** Textarea that grows to fit its text. */
function AutoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + 2}px`;
  }, [props.value]);
  return <textarea ref={ref} rows={1} {...props} />;
}

/** A list of sentences (bullets) with add / remove / reorder. */
export function BulletsInput({ label, value, onChange, hint, addLabel = "Add point" }: {
  label: string; value: string[]; onChange: (v: string[]) => void; hint?: string; addLabel?: string;
}) {
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <ul className="space-y-2">
        {value.map((item, i) => (
          <li key={i} className="flex items-start gap-1.5">
            <span aria-hidden="true" className="mt-[1.15rem] h-1.5 w-1.5 shrink-0 rounded-full bg-fg/30" />
            <AutoTextarea
              aria-label={`${label} ${i + 1}`}
              className={`${inputCls} ml-1 resize-none overflow-hidden py-2.5 leading-relaxed`}
              value={item}
              onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
            />
            <div className="flex flex-col">
              <IconButton label="Move up" onClick={() => onChange(move(value, i, i - 1))} disabled={i === 0}><ArrowUp size={15} /></IconButton>
              <IconButton label="Remove" tone="danger" onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash2 size={15} /></IconButton>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-2"><AddButton onClick={() => onChange([...value, ""])}>{addLabel}</AddButton></div>
    </div>
  );
}

/** Repeating pairs, e.g. architecture steps (label + detail) or stats (value + label). */
export function PairsInput<T extends Record<string, string>>({ label, value, onChange, fields, addLabel, hint }: {
  label: string; value: T[]; onChange: (v: T[]) => void; hint?: string; addLabel: string;
  fields: { key: keyof T & string; label: string; multiline?: boolean; width?: string }[];
}) {
  const blank = Object.fromEntries(fields.map((f) => [f.key, ""])) as T;
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <ol className="space-y-3">
        {value.map((row, i) => (
          <li key={i} className="flex items-start gap-2 rounded-2xl bg-surface/60 p-3 ring-1 ring-line/[0.06]">
            <span className="mt-3 w-5 shrink-0 text-center font-mono text-xs text-muted">{i + 1}</span>
            <div className="grid flex-1 gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
              {fields.map((f) =>
                f.multiline ? (
                  <AutoTextarea key={f.key} aria-label={f.label} placeholder={f.label} className={`${inputCls} resize-none overflow-hidden bg-elevated py-2.5`} value={row[f.key] ?? ""} onChange={(e) => onChange(value.map((r, j) => (j === i ? { ...r, [f.key]: e.target.value } : r)))} />
                ) : (
                  <input key={f.key} aria-label={f.label} placeholder={f.label} className={`${inputCls} bg-elevated py-2.5`} value={row[f.key] ?? ""} onChange={(e) => onChange(value.map((r, j) => (j === i ? { ...r, [f.key]: e.target.value } : r)))} />
                ),
              )}
            </div>
            <div className="flex flex-col">
              <IconButton label="Move up" onClick={() => onChange(move(value, i, i - 1))} disabled={i === 0}><ArrowUp size={15} /></IconButton>
              <IconButton label="Move down" onClick={() => onChange(move(value, i, i + 1))} disabled={i === value.length - 1}><ArrowDown size={15} /></IconButton>
              <IconButton label="Remove" tone="danger" onClick={() => onChange(value.filter((_, j) => j !== i))}><Trash2 size={15} /></IconButton>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-2"><AddButton onClick={() => onChange([...value, { ...blank }])}>{addLabel}</AddButton></div>
    </div>
  );
}

/** Image or PDF picker. Files are uploaded when you click Publish. */
export function UploadField({ label, value, onChange, kind = "image", hint }: {
  label: string; value?: string; onChange: (v: string) => void; kind?: "image" | "pdf"; hint?: string;
}) {
  const { upload, preview } = useUploads();
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const src = preview(value);
  const pick = async (file?: File) => {
    if (!file) return;
    setError("");
    if (file.size > 10 * 1024 * 1024) { setError("That file is over 10 MB. Please pick a smaller one."); return; }
    setBusy(true);
    try { onChange(await upload(file)); } finally { setBusy(false); }
  };
  return (
    <div>
      <Label hint={hint}>{label}</Label>
      <div className="flex items-center gap-4 rounded-2xl bg-surface p-3 ring-1 ring-line/10">
        <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-xl bg-elevated ring-1 ring-line/10">
          {value && kind === "image" && src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt="" className="h-full w-full object-cover" />
          ) : value ? (
            <FileText size={26} className="text-accent" aria-hidden="true" />
          ) : kind === "image" ? (
            <ImagePlus size={24} className="text-muted" aria-hidden="true" />
          ) : (
            <FileText size={24} className="text-muted" aria-hidden="true" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-muted">{value ? value.split("/").pop() : "Nothing chosen yet"}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={() => input.current?.click()} className="btn-secondary !px-3.5 !py-1.5 text-[13px]" disabled={busy}>
              <Upload size={14} aria-hidden="true" /> {busy ? "Adding…" : value ? "Replace" : "Choose file"}
            </button>
            {value && (
              <button type="button" onClick={() => onChange("")} className="rounded-full px-3 py-1.5 text-[13px] text-red-600 hover:bg-red-500/10 dark:text-red-400">Remove</button>
            )}
          </div>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
        <input
          ref={input}
          type="file"
          hidden
          accept={kind === "image" ? "image/png,image/jpeg,image/webp,image/gif,image/svg+xml" : "application/pdf"}
          onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ section card */

/** A labelled on/off switch. */
export function Toggle({ label, checked, onChange, hint }: { label: string; checked: boolean; onChange: (v: boolean) => void; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span aria-hidden="true" className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full bg-line/20 transition peer-checked:bg-accent peer-focus-visible:ring-2 peer-focus-visible:ring-accent after:absolute after:left-0.5 after:top-0.5 after:h-4 after:w-4 after:rounded-full after:bg-white after:shadow after:transition peer-checked:after:translate-x-4" />
      <span>
        <span className="text-sm font-medium">{label}</span>
        {hint && <span className="mt-0.5 block text-xs text-muted">{hint}</span>}
      </span>
    </label>
  );
}

export function Card({ id, title, subtitle, action, children }: {
  id: string; title: string; subtitle?: string; action?: ReactNode; children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-24 rounded-3xl bg-elevated p-6 ring-1 ring-line/[0.07] shadow-[0_1px_2px_rgba(0,0,0,0.04)] sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h2 id={`${id}-h`} className="text-xl font-semibold tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
