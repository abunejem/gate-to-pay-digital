export const en = {
  brand: {
    name: "Gate to Pay",
    tagline: "Financial infrastructure for MENA and beyond",
  },
  nav: {
    products: "Products",
    solutions: "Solutions",
    developers: "Developers",
    pricing: "Pricing",
    company: "Company",
    signIn: "Sign in",
    getStarted: "Get started",
  },
  trust: {
    cbj: "CBJ Licensed",
    mastercard: "Mastercard Principal Member",
    visa: "Visa Enabled",
    unionpay: "UnionPay Enabled",
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
