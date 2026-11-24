"use client";
import Image from "next/image";
import { useCallback, useState } from "react";
import { Award, BadgeCheck, CalendarDays, Download, ExternalLink, Hash, Maximize2 } from "lucide-react";
import { certifications, type Certification } from "@/content/certifications";
import { Lightbox } from "./Lightbox";
import { Reveal } from "./Reveal";
import { Section } from "./Section";

export function Certifications() {
  const [open, setOpen] = useState<Certification | null>(null);
  const close = useCallback(() => setOpen(null), []);
  const [featured, ...rest] = certifications;

  return (
    <Section
      id="certifications"
      eyebrow="Certifications"
      title={<>Certifi&shy;<em>cations</em></>}
    >
      {featured && (
        <Reveal>
          <article className="card overflow-hidden">
            <div className="grid lg:grid-cols-[1.45fr_1fr]">
              {/* Certificate display */}
              <div className="relative bg-gradient-to-br from-surface via-bg to-surface p-5 sm:p-10">
                <div className="grid-fade pointer-events-none absolute inset-0" aria-hidden="true" />
                <CertificateFrame cert={featured} onOpen={() => setOpen(featured)} />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-center border-t border-line/[0.06] p-7 sm:p-10 lg:border-l lg:border-t-0">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  <BadgeCheck size={14} aria-hidden="true" /> Featured certification
                </span>
                <div className="mt-6 flex items-start gap-4">
                  {featured.badge && (
                    <Image src={featured.badge} alt={`${featured.title} badge`} width={64} height={71} className="h-16 w-auto shrink-0" />
                  )}
                  <div>
                    <p className="text-sm text-muted">{featured.issuer}</p>
                    <h3 className="mt-1 text-2xl font-semibold leading-tight tracking-tight sm:text-[1.7rem]">{featured.title}</h3>
                  </div>
                </div>
                <CertDetails cert={featured} />
                <div className="mt-8 flex flex-wrap gap-3">
                  {featured.image && (
                    <button type="button" onClick={() => setOpen(featured)} className="btn-secondary">
                      <Maximize2 size={15} aria-hidden="true" /> View certificate
                    </button>
                  )}
                  {featured.verifyUrl && (
                    <a href={featured.verifyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                      Verify on Credly <ExternalLink size={15} aria-hidden="true" />
                    </a>
                  )}
                  {featured.pdf && (
                    <a href={featured.pdf} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                      <Download size={15} aria-hidden="true" /> PDF
                    </a>
                  )}
                </div>
                {featured.verifyUrl?.includes("aws.amazon.com/verification") && featured.credentialId && (
                  <p className="mt-4 text-xs leading-relaxed text-muted">
                    To verify, enter the validation number above at {featured.verifyUrl.replace(/^https?:\/\//, "")}.
                  </p>
                )}
              </div>
            </div>
          </article>
        </Reveal>
      )}

      {rest.length > 0 && (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.06}>
              <article className="card flex h-full flex-col overflow-hidden">
                <div className="bg-surface p-4">
                  <CertificateFrame cert={c} onOpen={() => setOpen(c)} small />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm text-muted">{c.issuer}</p>
                  <h3 className="mt-1 text-lg font-semibold leading-snug tracking-tight">{c.title}</h3>
                  <CertDetails cert={c} />
                  {c.verifyUrl && (
                    <a href={c.verifyUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost mt-auto self-start pt-4">
                      Verify credential <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  )}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      <Lightbox src={open?.image ?? null} alt={open ? `${open.title} certificate` : ""} onClose={close} />
    </Section>
  );
}

/** Framed certificate image (landscape, like a printed certificate). Click to enlarge. */
function CertificateFrame({ cert, onOpen, small = false }: { cert: Certification; onOpen: () => void; small?: boolean }) {
  const frame = "relative mx-auto aspect-[1.294/1] w-full overflow-hidden rounded-xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] ring-1 ring-black/10";
  if (cert.image) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className={`group block w-full bg-[#232f3e] ${frame} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent`}
        aria-label={`View larger image of the ${cert.title} certificate`}
      >
        <Image
          src={cert.image}
          alt={`${cert.title} certificate issued by ${cert.issuer}`}
          fill
          sizes={small ? "(min-width: 1024px) 360px, 90vw" : "(min-width: 1024px) 680px, 95vw"}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />
        <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 size={13} aria-hidden="true" /> Enlarge
        </span>
      </button>
    );
  }
  // Placeholder until the real certificate image is added in content/certifications.ts.
  return (
    <div className={`${frame} relative grid place-items-center bg-elevated`} role="img" aria-label={`${cert.title} certificate (image to be added)`}>
      <div className="absolute inset-3 rounded-lg border border-dashed border-line/15" aria-hidden="true" />
      <div className="relative flex flex-col items-center px-6 text-center">
        <span className={`grid place-items-center rounded-2xl bg-accent/10 text-accent ${small ? "h-12 w-12" : "h-16 w-16"}`}>
          <Award size={small ? 24 : 30} strokeWidth={1.5} aria-hidden="true" />
        </span>
        {!small && <span className="mt-4 text-base font-medium text-fg">{cert.title}</span>}
        <span className="mt-1.5 text-xs text-muted">Certificate image coming soon</span>
      </div>
    </div>
  );
}

function CertDetails({ cert }: { cert: Certification }) {
  const rows = [
    cert.issued && { icon: CalendarDays, label: "Issued", value: cert.issued },
    cert.expires && { icon: CalendarDays, label: "Expires", value: cert.expires },
    cert.credentialId && { icon: Hash, label: "Validation no.", value: cert.credentialId, mono: true },
  ].filter(Boolean) as { icon: typeof Hash; label: string; value: string; mono?: boolean }[];
  if (!rows.length) return null;
  return (
    <dl className="mt-6 space-y-3 text-sm">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3">
          <r.icon size={15} className="shrink-0 text-muted" aria-hidden="true" />
          <dt className="w-28 text-muted">{r.label}</dt>
          <dd className={`min-w-0 break-all text-fg ${r.mono ? "font-mono text-[13px]" : ""}`}>{r.value}</dd>
        </div>
      ))}
    </dl>
  );
}
