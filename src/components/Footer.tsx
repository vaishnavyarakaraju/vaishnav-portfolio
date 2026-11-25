import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="border-t border-line/[0.06] py-10">
      <div className="container-x flex flex-col items-start justify-between gap-4 text-sm text-muted sm:flex-row sm:items-center">
        <p>© {new Date().getFullYear()} {site.fullName}</p>
        <nav aria-label="Footer" className="flex gap-6">
          <a href={`mailto:${site.email}`} className="hover:text-fg">Email</a>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-fg">LinkedIn</a>
          {site.github && <a href={site.github} target="_blank" rel="noopener noreferrer" className="hover:text-fg">GitHub</a>}
          <a href={site.resume} download={site.resumeFileName} className="hover:text-fg">Resume</a>
        </nav>
      </div>
    </footer>
  );
}
