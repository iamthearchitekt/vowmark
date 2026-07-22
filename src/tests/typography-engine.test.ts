import { describe, it, expect } from "vitest";
import { TypographyEngine } from "../lib/typography/engine";

describe("Deterministic Typography Engine", () => {
  it("should render clean vector SVG for stacked names without misspelling", () => {
    const rendered = TypographyEngine.renderSvg({
      primaryText: "Erick",
      secondaryText: "Emily",
      fontFamily: "Cormorant Garamond",
      fontSize: 72,
      layout: "stacked",
      colorMode: "black_on_white",
    });

    expect(rendered.svg).toContain("Erick");
    expect(rendered.svg).toContain("Emily");
    expect(rendered.svg).toContain("<svg");
    expect(rendered.isVector).toBe(true);
  });
});
