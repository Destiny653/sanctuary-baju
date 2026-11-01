import { describe, expect, it } from "vitest";
import { videoTimeForProgress } from "@/components/sanctuary/video-progress";

describe("Homepage video scroll scrubbing", () => {
  it("maps forward scrolling to later frames", () => {
    expect(videoTimeForProgress(0, 20)).toBe(0);
    expect(videoTimeForProgress(0.75, 20)).toBeCloseTo(14.96875);
  });
  it("maps backward scrolling to earlier frames", () => {
    expect(videoTimeForProgress(0.25, 20)).toBeCloseTo(4.989583);
    expect(videoTimeForProgress(0.25, 20)).toBeLessThan(videoTimeForProgress(0.75, 20));
  });
  it("keeps seeks within the video even beyond the pinned section", () => {
    expect(videoTimeForProgress(-1, 20)).toBe(0);
    expect(videoTimeForProgress(2, 20)).toBeCloseTo(19.958333);
    expect(videoTimeForProgress(0.5, Number.NaN)).toBe(0);
  });
});