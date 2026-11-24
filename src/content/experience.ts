/** Work history, newest first. Edit in /content/experience.json or at /admin. */
import { toList } from "./list";
import data from "../../content/experience.json";

export type Experience = {
  company: string;
  role: string;
  location?: string;
  start: string;
  end: string;
  summary: string;
  highlights: string[];
  responsibilities: string[];
  tools: string[];
  logo?: string;
};

export const experience: Experience[] = (data.jobs as unknown as Partial<Experience>[]).map((j) => ({
  company: j.company ?? "",
  role: j.role ?? "",
  location: j.location,
  start: j.start ?? "",
  end: j.end ?? "",
  summary: j.summary ?? "",
  highlights: j.highlights ?? [],
  responsibilities: j.responsibilities ?? [],
  tools: toList(j.tools),
  logo: j.logo,
}));
