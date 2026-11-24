/** Education. Edit in /content/education.json or at /admin. */
import { toList } from "./list";
import data from "../../content/education.json";

export type Education = {
  institution: string;
  location: string;
  degree: string;
  concentration?: string;
  start: string;
  end: string;
  coursework?: string[];
  logo?: string;
};

export const education: Education[] = (data.items ?? []).map((e) => ({ ...e, coursework: toList(e.coursework) }));
