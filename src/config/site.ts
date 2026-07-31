export const SITE_CONFIG = {
  name: "VOWMARK",
  domain: "vowmark.studio",
  tagline: "Bespoke Wedding Identity & Stationery Studio",
  description: "Custom wedding identity, luxury monograms, and stationery design.",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://vowmark.studio",
  ogImage: "https://vowmark.studio/og.png",
  links: {
    twitter: "https://twitter.com/vowmarkstudio",
    github: "https://github.com/iamthearchitekt/vowmark",
  },
  defaultBranding: {
    primaryColor: "#C9A251", // Gold Accent Hex: #C9A251
    secondaryColor: "#000000",
    paperColor: "#FFFFFF",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
