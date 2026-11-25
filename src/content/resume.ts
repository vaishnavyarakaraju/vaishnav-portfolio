/** Resume-only settings. Edit in /content/resume.json or in the editor's Resume card. */
import data from "../../content/resume.json";

export const resumeSettings = {
  summaryHeading: data.summaryHeading || "Professional Summary",
  summary: data.summary ?? "",
  phone: data.phone ?? "",
  fileName: data.fileName || "Resume.pdf",
};

/** Where the generated resume PDF is served. */
export const RESUME_PDF_PATH = "/resume.pdf";
