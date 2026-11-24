/** Projects. Edit in /content/projects.json or at /admin. Each gets a page at /projects/<slug>. */
import { toList } from "./list";
import data from "../../content/projects.json";

export type DiagramKey = "etl" | "monitoring" | "deploy" | "identity" | "reconcile";

export type Project = {
  slug: string;
  title: string;
  category: string;
  source: string;
  tagline: string;
  overview: string;
  problem: string;
  architecture: { label: string; detail: string }[];
  technologies: string[];
  contribution: string[];
  results: string[];
  diagram: DiagramKey;
  github?: string;
  demo?: string;
  screenshots?: { src: string; alt: string }[];
};

export const projectCategories: string[] = toList(data.categories);

export const projects: Project[] = (data.projects as unknown as Partial<Project>[]).map((p) => ({
  slug: p.slug ?? "",
  title: p.title ?? "",
  category: p.category ?? "",
  source: p.source ?? "",
  tagline: p.tagline ?? "",
  overview: p.overview ?? "",
  problem: p.problem ?? "",
  architecture: p.architecture ?? [],
  technologies: toList(p.technologies),
  contribution: p.contribution ?? [],
  results: p.results ?? [],
  diagram: (p.diagram ?? "etl") as DiagramKey,
  github: p.github,
  demo: p.demo,
  screenshots: p.screenshots ?? [],
}));

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
