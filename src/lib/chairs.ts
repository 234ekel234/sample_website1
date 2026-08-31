// The professorial chairs endowed at the Academy.
//
// THE LIST BELONGS TO PMAFI, NOT TO THIS FILE. Chairs are endowed as gifts
// arrive, so the roll changes without a developer being involved. It is read
// from the \`Chairs\` tab of the content spreadsheet — one chair per row in
// column A, exactly as it should appear on the page — and staff add a chair by
// adding a row. Guide: references/content-sheet-setup.md.
//
// The array below is the FALLBACK, not the source. It is the roll as PMAFI
// published it at 31 December 2025, and it renders when the sheet is empty or
// briefly unreachable — the same bargain content.ts strikes everywhere else,
// because an honour wall that silently empties itself is worse than one that is
// a few months out of date.
//
// WHY THE FALLBACK IS NOT SIMPLY DELETED once the sheet is filled: this list
// took a careful transcription out of a PDF, and it is the only copy that is
// version-controlled. See the provenance notes below before editing it.
//
// NO AMOUNTS, EVER. The 2025 annual report prints what several of these chairs
// cost and who paid, in the same table. That pairing is what /donate/status
// withholds behind a reference code and what is blurred out of the cheque
// photograph on /donate. A name is the acknowledgment the donor was promised;
// the sum is not. The sheet has one column for the same reason.
//
// SOURCE: PMAFI Annual Report 2025, pp.7-10, "PMAFI PROFESSORIAL CHAIRS (160),
// As of 31 December 2025". Transcribed from the PDF rather than retyped.
// Mechanical artefacts were repaired (a doubled trailing "Chair", a stray "7",
// two missing spaces); NOT ONE PERSON NAME WAS RESPELLED, however odd it looks.
// Several are probably typos in the report itself — "Congressman Jose S
// Conjuangco", "PBeg Dionardo B Carlos", "Col Profirio Santos", "RAmd Nichols A
// Driz" — and guessing at the right spelling of a benefactor is a worse error
// than reproducing the Foundation's own.
//
// TWO ENTRIES, ONE MAN. The report lists both "BGen Dionardo b Carlos ’88"
// and "PBeg Dionardo B Carlos" while its own heading counts 160, so the list
// below holds 161. He may have endowed two chairs, or the list may double up.
// Until PMAFI says which, both stay and NO COUNT IS PRINTED on the page — a
// tally that disagrees with the roll beneath it is the one thing worse than
// having no tally at all.

import { readRange } from "@/lib/sheets";

/** Tab name, and the column the chair names live in. */
const CHAIRS_RANGE = "Chairs!A2:A";

/** The roll as published at 31 December 2025. Fallback only — see above. */
export const FALLBACK_CHAIRS: string[] = [
  "AFPMBAI Chair in Management",
  "MGen Ramon E Montano Chair",
  "Pres Fidel V Ramos Chair in Leadership",
  "BGen Jacinto A Galang, Jr Chair",
  "LtCol Augusto R Mondonedo Chair in Mathematics",
  "Col Felix P Duenas, Sr Chair in Economics",
  "VAdm Carlito Y Cunanan Chair in Physics",
  "Union Bank Chair in English",
  "Col Juanito N Ferrer Chair in Engineering",
  "Dr Feliciano F Miravite Chair in Actuarial Science & Philosophy",
  "LGen Loven C Abadia Chair",
  "Gen Lisandro C Abadia Chair",
  "Lt Lino C Abadia, Jr Chair",
  "PMA Class 1942 Chair in English",
  "Far East Bank & Trust Co. Chair",
  "BGen Rosalino A Alquiza Chair in Ethics",
  "Col Victor M Punzalan Chair in Law",
  "PMA Class 1954 Chair in Mechanics",
  "Don Emilio T Yap Chair in Humanities",
  "Metrobank Foundation Chair in English II",
  "PMA Class 1957 Chair",
  "PMA Class 1967 Chair",
  "BGen Jose M Crisol Chair in Military History",
  "Commo Ramon A Alcaraz Chair in Naval Studies",
  "San Miguel Corporation Chair",
  "Liwayway Publishing, Inc. Chair",
  "Manila Bulletin Publishing Corporation Chair",
  "PCIBank Foundation Chair",
  "Congressman Jose S Conjuangco, Jr Chair in History II",
  "PhilTrust Bank Chair",
  "Euro-Med Laboratories Phil. Chair",
  "PMA Class 1963 Chair",
  "Bangko Sentral ng Pilipinas Chair in Finance",
  "VAdm Pio P Carranza, FOIC, PN Chair in Naval Science",
  "LGen Orlando DV Soriano, CG, PA Chair in Environmental Protection",
  "Senator Juan Ponce Enrile Chair in Political Science",
  "PDGen Recaredo A Sarmiento II, Chief, PNP Chair in Law",
  "National Steel Corporation Chair",
  "Philippine Veterans Bank Chair in History of WW II",
  "PMA Class 1968 Chair in Development Economics",
  "Ayala Land, Inc. Chair in Ecology",
  "Gen Arturo T Enrile Chair",
  "Philippine Amusement & Gaming Corporation Chair",
  "LtCol Renato G Reyes Chair",
  "BGen Francisco V Gatmaitan Chair in Engineering",
  "Col Mateo M Dizon Chair",
  "PMA Class 1962 Foundation Chair",
  "Senator Gregorio B Honasan Chair",
  "PMA Class 1966 Chair",
  "Public Estates Authority Chair in Humanities",
  "Social Security System Chair",
  "Fil-Estate Land, Inc. Chair in Environmental Protection",
  "VAdm Eduardo Ma R Santos, FOIC, PN Chair",
  "Speaker Manuel B Villar, Jr Chair in Management",
  "Gen Clemente P Mariano Chair",
  "BGen Romulo R Cabantac Chair",
  "BGen Mario S Espina Chair in History",
  "Col Rosendo V Cruz Chair in Physical Education",
  "Philippine Ports Authority Chair in Maritime Studies",
  "The Maritime League Chair in Maritime Studies",
  "PMA Class 1952 Chair in Military Science and Tactics",
  "College Assurance Plan Chair in Computer Science",
  "BGen Angel G Kanapi Chair in Military Leadership",
  "Philippine Army Chair",
  "Amb Alejandro B Melchor, Jr Chair in Nat’l Security and Development",
  "Col Feliberto B Cavosora Chair in Ethics and Leadership",
  "BGen Mamerto S Bocanegra Chair in Engineering",
  "PDGen Roberto T Lastimoso, Chief, PNP Chair",
  "Capt(PN) Antonio O Tansingco Chair in Civil Engineering",
  "Col Ramon L Lugtu Chair",
  "Congressman Roilo S Golez-PMA Class 1970 Chair",
  "BGen Antonio P Abaya Chair in Information Technology",
  "PMA Class 1953 Chair",
  "Balbanero Group of Companies Chair",
  "National Security Council Chair",
  "Don Sulpicio Go Chair",
  "WG and A Philippines Chair",
  "Gen Joselin B Nazareno, CS, AFP Chair",
  "PMA Class 1971 Chair",
  "BGen Orlando Q Antonio Chair",
  "Juan O Pena Chair",
  "Jesus N Alcordo Chair",
  "BGen Eustaquio V Meim Chair",
  "PMA Class 1959 Chair",
  "Congressman Plaridel M Abaya Chair",
  "Herminio S Esguerra Chair",
  "Ayala Corporation Chair",
  "Col Generoso F Tanseco Chair",
  "Gen Angelo T Reyes, CS, AFP Chair",
  "Col Graciano P Lacanlale, Jr Chair",
  "PMA Class 1975 Chair",
  "PMA Class 1970 Chair",
  "Capt Emmanuel V Gaor Chair in Electrical Engineering",
  "PMA Class 1974 Chair",
  "PMA Class 1969 Chair",
  "LGen Benjamin P Defensor, CG, PAF Chair",
  "BGen Bernabe D Salvador Chair",
  "BGen Teodulfo S Bautista Chair",
  "PMA Class 1951 Chair",
  "PDGen Leandro R Mendoza Chair",
  "Gen Diomedio P Villanueva Chair",
  "Carlos De Leon Chair",
  "VAdm Ariston V de los Reyes AFP Chair in Mathematics",
  "PDir Diony A Ventura Chair",
  "LGen Ernesto G Carolina/PVAO Administrator Chair",
  "Salvacion S Alquiza Chair in Accountancy",
  "PDDGen Anselmo S Avenido Jr Chair in Leadership and Management",
  "Philippine Veterans Affairs Office Chair",
  "PDGen Jesus A Verzosa Chair",
  "LGen Oscar H Rabena Chair in Engineering",
  "PDGen Raul M Bacalzo Chair",
  "Lt Christopher Alexis Mariano Chair",
  "JC Binay Foundation, Inc Chair",
  "PDGen Nicanor A Bartolome Chair",
  "MGen Jose C Lapus Chair",
  "Col Rodovaldo Maluyo Chair",
  "PDir Rufino G Ibay Jr Chair",
  "BGen Pacifico M Lopez de Leon Chair in Filipino Language and Culture",
  "LtGen Jeffrey F Delgado Chair in Development Management",
  "Col Edgardo Q Abesamis Chair in Military History",
  "Mr Ricardo S Tanseco Chair In Info Technology",
  "VAdm Jesus C Millan Chair",
  "PDGen Ricardo C Marquez Chair",
  "Cav John G Corpuz - PMA Class 1991 Chair",
  "PDGen Edgar Aglipay Chair",
  "LGen Eduardo Año Chair",
  "PMA Class 1956 Chair",
  "PMA Class 1986 Chair",
  "PDir Jose C Lalisan Chair",
  "Gen Carlito G Galvez Jr AFP, Chair",
  "AFP Savings and Loan Association, Inc. Chair",
  "DMW Chair in Civil Engineering",
  "Delfin J Wenceslao Jr, Chair in SPACE Technology",
  "BGen Benjamin R Madrigal Jr’88 Chair",
  "BGen Dionardo b Carlos ’88 Chair",
  "PBGen Ramon L Rafel & Family Chair",
  "LGen Rozzano D Briguez Chair",
  "PBGen Ferdinand B Daway Chair",
  "PBGen Marni C Marcos Jr Chair",
  "PMGen Emmanuel Luis D Licup Chair",
  "PMGen Guillermo Lorenzo Eleazar Chair",
  "Atty Nilo Divina Chair",
  "BGen Amaury Evangelista’87 Chair",
  "PBGen Joel S Orduña’88 Chair",
  "PMGen Leo Angelo D Leuterio’88 Chair",
  "Dr Nelia A Evangelista ’62 Chair in Social Sciences",
  "Col Profirio Santos Chair",
  "Col Joel Emmanuel L Mariano Chair",
  "BGen Manuel Mariano Chair",
  "LtCol Arthur Balmaceda Chair",
  "LtCdr Socrates Brazal Chair",
  "PLtGen Ricardo De Leon Chair",
  "LtGen Romeo Dominguez Chair",
  "PMGen Vicente Danao Chair",
  "Cav Amado T Espino Chair",
  "PBeg Dionardo B Carlos Chair",
  "Cav Romeo S Brawner Jr Chair",
  "BGen Leoncio S Tan Chair in Law",
  "RAmd Nichols A Driz Chair",
  "Sen Joseph Victor Ejercito Chair",
  "Admiral Ronnie Gil L Gavan Chair",
];

/**
 * Parse sheet rows into chair names. Exported for testing.
 *
 * A blank row is skipped rather than rendered as an empty bullet: a staff
 * member who deletes a chair usually clears the cell instead of removing the
 * row, and a gap in a spreadsheet should not become a gap in an honour wall.
 */
export function parseChairs(rows: unknown[][]): string[] {
  const chairs: string[] = [];
  for (const row of rows) {
    const name = String(row[0] ?? "").trim();
    if (name) chairs.push(name);
  }
  return chairs;
}

/**
 * The chairs to display, newest sheet content first choice.
 *
 * Returns FALLBACK_CHAIRS when the sheet is missing, unreachable or empty.
 * Unlike fund updates — where an empty feed must render an honest empty state
 * rather than invent an achievement — every name here is already a matter of
 * public record in PMAFI's own annual report, so showing the last known good
 * roll states nothing that was not already true.
 */
export async function getChairs(): Promise<string[]> {
  const sheetId = process.env.CONTENT_SHEET_ID;
  if (!sheetId) return FALLBACK_CHAIRS;

  try {
    const rows = await readRange(sheetId, CHAIRS_RANGE, { revalidate: 60 });
    const chairs = parseChairs(rows);
    return chairs.length > 0 ? chairs : FALLBACK_CHAIRS;
  } catch {
    return FALLBACK_CHAIRS;
  }
}
