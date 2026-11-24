/** Certifications. Edit in /content/certifications.json or at /admin. */
import data from "../../content/certifications.json";

export type Certification = {
  title: string;
  issuer: string;
  issued?: string;
  expires?: string;
  credentialId?: string;
  verifyUrl?: string;
  /** Full certificate image (shown large, opens in a lightbox). */
  image?: string;
  /** Optional small badge shown beside the title. */
  badge?: string;
  /** Optional downloadable PDF of the certificate. */
  pdf?: string;
};

export const certifications: Certification[] = data.items ?? [];
