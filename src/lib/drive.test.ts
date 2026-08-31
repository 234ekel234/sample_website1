import { describe, it, expect } from "vitest";
import { indexFiles, resolveName } from "@/lib/drive";

const files = [
  { id: "1", name: "handover.jpg" },
  { id: "2", name: "Class 1967 Turnover.JPG" },
  { id: "3", name: "awarding.png" },
  { id: "4", name: "awarding.jpg" }, // same basename as 3, different file
];

const index = indexFiles(files);

describe("resolveName", () => {
  it("matches the exact file name", () => {
    expect(resolveName(index, "handover.jpg")).toBe("1");
  });

  it("ignores case, because nobody types a file name the way Drive stores it", () => {
    expect(resolveName(index, "HANDOVER.JPG")).toBe("1");
    expect(resolveName(index, "class 1967 turnover.jpg")).toBe("2");
  });

  it("forgives a missing extension", () => {
    expect(resolveName(index, "handover")).toBe("1");
  });

  it("trims what a spreadsheet leaves behind", () => {
    expect(resolveName(index, "  handover.jpg  ")).toBe("1");
  });

  it("REFUSES an ambiguous basename rather than guessing", () => {
    // awarding.png and awarding.jpg may be different photographs of different
    // people. Picking one would attach a caption to the wrong picture, and the
    // caption is what the site asserts about it.
    expect(resolveName(index, "awarding")).toBeNull();
    // Naming the extension resolves it.
    expect(resolveName(index, "awarding.png")).toBe("3");
    expect(resolveName(index, "awarding.jpg")).toBe("4");
  });

  it("returns null for a name that is not in the folder", () => {
    expect(resolveName(index, "nothing-like-this.jpg")).toBeNull();
  });

  it("returns null for an empty cell", () => {
    expect(resolveName(index, "   ")).toBeNull();
  });

  it("keeps the first of two identically named files, stably", () => {
    // Drive allows duplicate names in one folder. There is no right answer;
    // there is a wrong one, which is changing the answer between page loads.
    const dupes = indexFiles([
      { id: "first", name: "same.jpg" },
      { id: "second", name: "same.jpg" },
    ]);
    expect(resolveName(dupes, "same.jpg")).toBe("first");
  });
});
