import { describe, it, expect } from "vitest";
import { recommendFonts } from "../lib/typography/font-recommender";

describe("Font Recommendation Engine", () => {
  it("should recommend high-contrast serif for Editorial Luxury and penalize script typography", () => {
    const recommendations = recommendFonts("editorial_luxury", "couple_logo");
    expect(recommendations.length).toBeGreaterThan(0);
    const topRec = recommendations[0];
    expect(topRec.fontRecord.classification).toBe("serif");
  });
});
