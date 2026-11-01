import { describe, expect, it } from "vitest";
import { narrationChapter } from "@/components/sanctuary/film-narration";

describe("Narration follows the film in both directions", () => {
  it("advances through five chapters with the video", () => {
    expect([0, 0.21, 0.41, 0.61, 0.81].map(p => narrationChapter(p, 5))).toEqual([0, 1, 2, 3, 4]);
  });
  it("restores earlier narration when the film rewinds", () => {
    expect([0.9, 0.5, 0.1].map(p => narrationChapter(p, 5))).toEqual([4, 2, 0]);
  });
  it("keeps the final chapter at the end and safely handles invalid times", () => {
    expect(narrationChapter(1, 5)).toBe(4);
    expect(narrationChapter(-1, 5)).toBe(0);
    expect(narrationChapter(Number.NaN, 5)).toBe(0);
  });
});