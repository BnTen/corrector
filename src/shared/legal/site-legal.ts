/** Identity used across Mentions légales / CGU / Confidentialité. */
export const SITE_LEGAL = {
  brandName: "Text Corrector",
  siteUrl: "https://corrector.prooff.fr",
  /** Nom commercial / marque */
  tradeName: "Text Corrector",
  /**
   * Éditeur du service — compléter avec la raison sociale réelle,
   * forme juridique, SIRET et adresse du siège avant mise en prod « officielle ».
   */
  publisher: {
    legalName: "Prooff",
    legalForm: "Entrepreneur individuel / structure à confirmer",
    address: "France — adresse du siège à compléter",
    siret: "SIRET à compléter",
    rcs: "RCS / RM à compléter le cas échéant",
    director: "Le responsable de publication",
    contactEmail: "contact@corrector.prooff.fr",
    dpoEmail: "privacy@corrector.prooff.fr",
  },
  host: {
    name: "Hostinger International Ltd.",
    address: "61 Lordou Vironos Street, 6023 Larnaca, Chypre",
    website: "https://www.hostinger.fr",
    note: "Infrastructure déployée via Coolify sur serveur VPS.",
  },
  lastUpdated: "22 juillet 2026",
} as const;

export const LEGAL_NAV = [
  { href: "/mentions-legales", label: "Mentions légales" },
  { href: "/confidentialite", label: "Confidentialité" },
  { href: "/cgu", label: "CGU" },
] as const;
