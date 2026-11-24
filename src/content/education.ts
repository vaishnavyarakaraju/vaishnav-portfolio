/** Education history. Add coursework or academic projects when available. */
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

export const education: Education[] = [
  {
    institution: "George Mason University",
    location: "Virginia, USA",
    degree: "Master of Science in Information Systems",
    concentration: "Cloud-based Information Systems",
    start: "Aug 2023",
    end: "May 2025",
    coursework: [],
  },
];
