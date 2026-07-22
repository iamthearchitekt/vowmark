export const SITE_CONFIG = {
  name: "VOWMARK",
  tagline: "AI-Powered Wedding Identity & Stationery Asset Generator",
  description:
    "Refined, high-end wedding identity design combining conversational AI, deterministic vector typography, and wedding intelligence.",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "https://vowmark.com/og.jpg",
  links: {
    twitter: "https://twitter.com/vowmark",
    github: "https://github.com/vowmark",
  },
  defaultBranding: {
    primaryColor: "#C9A251", // Gold Accent Hex: #C9A251
    secondaryColor: "#0F172A",
    paperColor: "#FFFFFF",
  },
} as const;

export type SiteConfig = typeof SITE_CONFIG;
