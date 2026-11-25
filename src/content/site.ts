/**
 * Site settings. Content lives in /content/profile.json and is edited at /admin.
 */
import { toList } from "./list";
import { RESUME_PDF_PATH, resumeSettings } from "./resume";
import profile from "../../content/profile.json";

export type Profile = typeof profile;

export const site = {
  ...profile,
  disciplines: toList(profile.disciplines),
  url: process.env.NEXT_PUBLIC_SITE_URL || profile.url,
  github: profile.github ?? "",
  portrait: profile.portrait ?? "",
  // The resume PDF is generated from the site content on every deploy.
  resume: RESUME_PDF_PATH,
  resumeFileName: resumeSettings.fileName,
};

export type NavItem = { id: string; label: string };

export const navItems: NavItem[] = [
  { id: "home", label: "Home" },
  { id: "summary", label: "Summary" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "certifications", label: "Certifications" },
  { id: "education", label: "Education" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];
