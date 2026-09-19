import { describe, it, expect } from "vitest";
import { presentName } from "@/lib/card-name";
import { normalizeName } from "@/lib/members";

describe("presentName", () => {
  it("sets the supplied roll's upper case as a name", () => {
    expect(presentName("RICARDO DE LEON")).toBe("Ricardo De Leon");
    expect(presentName("BARTOLOME VINCENT BACARRO")).toBe("Bartolome Vincent Bacarro");
  });

  it("points a bare middle initial", () => {
    expect(presentName("LEO ANGELO D LEUTERIO")).toBe("Leo Angelo D. Leuterio");
    expect(presentName("JEEFRY JOSE M ABARCAR")).toBe("Jeefry Jose M. Abarcar");
  });

  it("does not double the point on an initial that has one", () => {
    expect(presentName("Simoun Ezequiel A. Tusi")).toBe("Simoun Ezequiel A. Tusi");
  });

  it("raises the letter after a hyphen", () => {
    // Both are on the roll. "Blanza-gualberto" would be a new kind of wrong.
    expect(presentName("JHONNA C BLANZA-GUALBERTO")).toBe("Jhonna C. Blanza-Gualberto");
    expect(presentName("MARY GRACE M GALVERO-DE LEON")).toBe("Mary Grace M. Galvero-De Leon");
  });

  it("abbreviates Jr and Sr with a point, and leaves roman numerals in capitals", () => {
    expect(presentName("ANASTACIO C CABADING JR")).toBe("Anastacio C. Cabading Jr.");
    expect(presentName("FELIMON JR G DELEON")).toBe("Felimon Jr. G. Deleon");
    expect(presentName("JUAN CRUZ III")).toBe("Juan Cruz III");
  });

  it("LEAVES A NAME THAT ALREADY CARRIES CASE ALONE", () => {
    // A member who applied through the form typed their own name, and some of
    // those spellings this function would get wrong. Never overwrite them.
    expect(presentName("Irvin Hibaler")).toBe("Irvin Hibaler");
    expect(presentName("Ronald McArthur")).toBe("Ronald McArthur");
    expect(presentName("Juan de la Cruz")).toBe("Juan de la Cruz");
    expect(presentName("Maria O'Brien-Reyes")).toBe("Maria O'Brien-Reyes");
  });

  it("collapses stray whitespace and survives an empty name", () => {
    expect(presentName("  RICARDO   DE  LEON ")).toBe("Ricardo De Leon");
    expect(presentName("   ")).toBe("");
  });

  it("CANNOT CHANGE WHO A LOOKUP MATCHES", () => {
    // The whole safety of doing this at the card rather than in the sheet:
    // normalizeName folds case and strips punctuation, so the presented name
    // and the stored one are the same name to every tier of the matcher.
    for (const stored of [
      "RICARDO DE LEON",
      "LEO ANGELO D LEUTERIO",
      "JHONNA C BLANZA-GUALBERTO",
      "ANASTACIO C CABADING JR",
    ]) {
      expect(normalizeName(presentName(stored))).toBe(normalizeName(stored));
    }
  });
});
