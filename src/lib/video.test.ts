import { describe, it, expect } from "vitest";
import { youtubeId, youtubeEmbedUrl } from "@/lib/video";

const REAL = "0Udz6CqYJNI"; // the Foundation's 38th anniversary film

describe("youtubeId", () => {
  it("reads every link shape YouTube actually hands out", () => {
    for (const url of [
      `https://youtu.be/${REAL}`,
      `https://www.youtube.com/watch?v=${REAL}`,
      `https://youtube.com/watch?v=${REAL}`,
      `https://m.youtube.com/watch?v=${REAL}`,
      `https://www.youtube.com/embed/${REAL}`,
      `https://www.youtube.com/shorts/${REAL}`,
      `https://www.youtube.com/live/${REAL}`,
      `https://www.youtube-nocookie.com/embed/${REAL}`,
    ]) {
      expect(youtubeId(url), url).toBe(REAL);
    }
  });

  it("drops the tracking the share button appends", () => {
    // The Share dialog gives `?si=...`, and a timestamp rides along if the
    // sharer had paused. Neither belongs in the page.
    expect(youtubeId(`https://youtu.be/${REAL}?si=AbCdEfGhIjKlMnOp`)).toBe(REAL);
    expect(youtubeId(`https://www.youtube.com/watch?v=${REAL}&t=42s`)).toBe(REAL);
  });

  it("accepts a link pasted without its scheme", () => {
    expect(youtubeId(`youtu.be/${REAL}`)).toBe(REAL);
    expect(youtubeId(`www.youtube.com/watch?v=${REAL}`)).toBe(REAL);
  });

  it("accepts a bare id", () => {
    expect(youtubeId(REAL)).toBe(REAL);
  });

  it("returns null for a blank key, which is what hides the section", () => {
    // A blank content key must hide the video entirely rather than render an
    // empty frame — the same rule every other content-driven control follows.
    expect(youtubeId("")).toBeNull();
    expect(youtubeId("   ")).toBeNull();
    expect(youtubeId(null)).toBeNull();
    expect(youtubeId(undefined)).toBeNull();
  });

  it("REFUSES A NON-YOUTUBE URL RATHER THAN GUESSING", () => {
    // Guessing would render a Vimeo or Drive link into a YouTube iframe src,
    // which produces a silent black box rather than an error anybody sees.
    expect(youtubeId("https://vimeo.com/123456789")).toBeNull();
    expect(youtubeId("https://drive.google.com/file/d/0Udz6CqYJNI/view")).toBeNull();
    expect(youtubeId("https://www.pmafi.org")).toBeNull();
    expect(youtubeId("not a url at all")).toBeNull();
  });

  it("rejects anything that is not exactly 11 id characters", () => {
    expect(youtubeId("https://youtu.be/tooshort")).toBeNull();
    expect(youtubeId("https://youtu.be/waaaaaaaaaytoolong")).toBeNull();
    expect(youtubeId("https://www.youtube.com/watch?v=has spaces")).toBeNull();
  });
});

describe("youtubeEmbedUrl", () => {
  it("uses the no-cookie domain", () => {
    // Not decoration: youtube.com sets cookies the moment the iframe exists.
    const url = youtubeEmbedUrl(REAL);
    expect(url.startsWith("https://www.youtube-nocookie.com/embed/")).toBe(true);
    expect(url).not.toContain("//www.youtube.com");
  });

  it("autoplays, because the iframe only exists after a click on play", () => {
    expect(youtubeEmbedUrl(REAL)).toContain("autoplay=1");
  });
});
