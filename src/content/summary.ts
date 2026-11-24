/** Summary content. Edit in /content/summary.json or at /admin. */
import data from "../../content/summary.json";

export type SummaryStat = { value: string; label: string };
export type SummaryArea = { icon: string; title: string; body: string };

export const summaryIntro: string = data.intro;
export const summaryStats: SummaryStat[] = data.stats ?? [];
export const summaryAreas: SummaryArea[] = data.areas ?? [];
