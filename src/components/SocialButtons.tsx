import { site } from "@/content/site";
import { GitHubIcon, LinkedInIcon } from "./BrandIcons";

/** LinkedIn + GitHub buttons. GitHub shows a "coming soon" state until site.github is set. */
export function SocialButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="btn-secondary">
        <LinkedInIcon /> LinkedIn
      </a>
      {site.github ? (
        <a href={site.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
          <GitHubIcon /> GitHub
        </a>
      ) : (
        <span className="btn-secondary cursor-not-allowed opacity-55" aria-disabled="true" title="GitHub profile coming soon">
          <GitHubIcon /> GitHub <span className="text-xs text-muted">soon</span>
        </span>
      )}
    </div>
  );
}
