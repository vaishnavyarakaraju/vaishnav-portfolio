/**
 * Global site settings. Edit these values to update the name, links and
 * headline used across the whole site.
 */
export const site = {
  name: "Vaishnav Yarakaraju",
  fullName: "Vaishnav Sai Vivek Varma Yarakaraju",
  initials: "VY",
  headline: "Systems Engineer",
  disciplines: [
    "Software Engineering",
    "Systems Engineering",
    "Cloud Engineering",
    "Data Engineering",
    "DevOps",
    "Automation",
  ],
  heroTitle: ["Engineering systems.", "Building solutions.", "Creating impact."],
  heroDescription:
    "I am a technology professional focused on software engineering, cloud infrastructure, data engineering, and automation. I enjoy solving complex technical problems and building reliable, scalable systems.",
  // Set this to the deployed URL (e.g. https://vaishnav.dev) once known.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vaishnav-portfolio.vercel.app",
  email: "vaishnavvarmayarakaraju@gmail.com",
  linkedin: "https://www.linkedin.com/in/vaishnav-yarakaraju-aa4126230/",
  // TODO: add GitHub profile URL once supplied, e.g. "https://github.com/username".
  github: "https://github.com/vaishnavyarakaraju" as string,
  resume: "/Vaishnav_Yarakaraju_Resume.pdf",
  location: "United States",
  // Replace with "/images/portrait.jpg" after adding a photo to /public/images.
  portrait: "" as string,
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
