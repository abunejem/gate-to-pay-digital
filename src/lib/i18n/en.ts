export const en = {
  brand: {
    name: "Gate to Pay",
    tagline: "Financial infrastructure for MENA and beyond",
  },
  nav: {
    products: "Products",
    solutions: "Solutions",
    platform: "Platform",
    whoItsFor: "Who it's for",
    developers: "Developers",
    company: "Company",
    pricing: "Pricing",
    signIn: "Client Login",
    getStarted: "Get started",
  },
  hero: {
    eyebrow: "Regulated financial infrastructure · Jordan",
    h1Before: "The financial infrastructure behind ",
    h1Highlight: "connected businesses",
    h1After: ".",
    sub: "Issue cards, open wallets, accept payments, and move money across local and global rails — on one regulated platform. We hold the licenses and build the rails, so you don't have to.",
    ctaPrimary: "Get started",
    ctaSecondary: "Explore the platform",
  },
  trust: {
    cbj: "CBJ Licensed",
    mastercard: "Mastercard Principal Member",
    efawateer: "eFAWATEERcom",
    pcidss: "PCI DSS",
    since: "Since 2014",
  },
  theme: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
  },
  showcase: {
    title: "Component library",
    subtitle: "Design system preview for Gate to Pay. Toggle themes to inspect both palettes.",
  },
  footer: {
    rights: "All rights reserved.",
    address: "Amman, Jordan",
  },
} as const;

export type Dict = typeof en;
