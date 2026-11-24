/** Where the editor saves. Change these if the repository is renamed or moved. */
export const REPO_OWNER = "vaishnavyarakaraju";
export const REPO_NAME = "vaishnav-portfolio";
export const REPO_BRANCH = "main";

/** The editable content files (in /content). */
export const CONTENT_FILES = [
  "profile",
  "summary",
  "experience",
  "projects",
  "skills",
  "certifications",
  "education",
  "about",
] as const;

export type ContentKey = (typeof CONTENT_FILES)[number];
export const contentPath = (key: ContentKey) => `content/${key}.json`;

/** Uploaded images and PDFs are stored here and served from /images/uploads. */
export const UPLOAD_DIR = "public/images/uploads";
export const UPLOAD_URL = "/images/uploads";
