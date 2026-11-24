/** Skill groups. Edit in /content/skills.json or at /admin. */
import { toList } from "./list";
import data from "../../content/skills.json";

export type SkillGroup = { title: string; icon: string; skills: string[] };
export const skillGroups: SkillGroup[] = (data.groups ?? []).map((g) => ({ title: g.title, icon: g.icon, skills: toList(g.skills) }));
