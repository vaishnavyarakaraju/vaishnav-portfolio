/** About Me. Edit in /content/about.json or at /admin. */
import { toList } from "./list";
import data from "../../content/about.json";

export const aboutParagraphs: string[] = data.paragraphs ?? [];
export const interests: string[] = toList(data.interests);
