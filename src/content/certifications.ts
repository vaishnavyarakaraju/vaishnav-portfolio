/**
 * Certifications. Only add real details.
 * - image: put the certificate image in /public/certifications/ and set the path.
 * - verifyUrl / credentialId / dates: fill in from the Credly or AWS badge page.
 */
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

export const certifications: Certification[] = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Amazon Web Services Training and Certification",
    issued: "May 21, 2025",
    expires: "May 21, 2028",
    // Validation number from the certificate (can also be checked at aws.amazon.com/verification).
    credentialId: "742922f640f147f9943b01fd59ef4bf2",
    verifyUrl: "https://www.credly.com/badges/8842e998-d95d-4b8b-a67d-6eb7772139da",
    image: "/certifications/aws-solutions-architect-associate.jpg",
    badge: "/certifications/aws-solutions-architect-associate-badge.png",
    pdf: "/certifications/aws-solutions-architect-associate.pdf",
  },
];
