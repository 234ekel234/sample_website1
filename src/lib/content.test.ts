import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { hasPaymentDetails, type SiteContent } from "@/lib/content";

// hasPaymentDetails decides whether the site tells a visitor to send money before
// PMAFI has confirmed anything. Getting it wrong in the permissive direction
// publishes a half-complete instruction — an amount with no destination, or a
// destination with no amount — so every partial combination is pinned here.

const EMPTY: SiteContent = {
  chairman: { name: "", title: "", body: [] },
  contact: { email: "", phone: "", address: "" },
  social: { facebook: "", instagram: "" },
  payment: {
    bankName: "",
    bankAccountName: "",
    bankAccountNumber: "",
    gcashName: "",
    gcashNumber: "",
  },
  dues: { regular: "", associate: "", affiliate: "" },
  finance: { email: "", phone: "", name: "" },
  forms: { donation: "" },
};

const withPayment = (p: Partial<SiteContent["payment"]>): SiteContent => ({
  ...EMPTY,
  payment: { ...EMPTY.payment, ...p },
});

const BANK = { bankName: "Test Bank", bankAccountNumber: "1234" };
const GCASH = { gcashName: "PMAFI", gcashNumber: "0917" };
const DUES = { regular: "P2,000 / year", associate: "", affiliate: "" };

describe("hasPaymentDetails", () => {
  it("is false on a site with nothing configured", () => {
    expect(hasPaymentDetails(EMPTY)).toBe(false);
  });

  it("needs a destination as well as an amount", () => {
    // An amount alone tells someone to pay, without saying where.
    expect(hasPaymentDetails({ ...EMPTY, dues: DUES })).toBe(false);
  });

  it("needs an amount as well as a destination", () => {
    // A destination alone invites someone to guess what to send.
    expect(hasPaymentDetails(withPayment(BANK))).toBe(false);
    expect(hasPaymentDetails(withPayment(GCASH))).toBe(false);
  });

  it("accepts either channel once dues are set", () => {
    expect(hasPaymentDetails({ ...withPayment(BANK), dues: DUES })).toBe(true);
    expect(hasPaymentDetails({ ...withPayment(GCASH), dues: DUES })).toBe(true);
  });

  it("rejects a half-filled bank block", () => {
    // A bank name with no account number is not somewhere money can be sent.
    expect(
      hasPaymentDetails({ ...withPayment({ bankName: "Test Bank" }), dues: DUES })
    ).toBe(false);
    expect(
      hasPaymentDetails({ ...withPayment({ bankAccountNumber: "1234" }), dues: DUES })
    ).toBe(false);
  });

  it("rejects a half-filled GCash block", () => {
    expect(
      hasPaymentDetails({ ...withPayment({ gcashName: "PMAFI" }), dues: DUES })
    ).toBe(false);
    expect(
      hasPaymentDetails({ ...withPayment({ gcashNumber: "0917" }), dues: DUES })
    ).toBe(false);
  });

  it("opens on any one category's dues, not all three", () => {
    // PMAFI may confirm one tier before the others; that is enough to publish.
    for (const tier of ["regular", "associate", "affiliate"] as const) {
      expect(
        hasPaymentDetails({
          ...withPayment(BANK),
          dues: { ...EMPTY.dues, [tier]: "P2,000" },
        })
      ).toBe(true);
    }
  });
});

// --- The leading-zero guard -------------------------------------------------
// readRange asks for UNFORMATTED_VALUE, so a numeric-formatted cell arrives as
// a JSON number and 0223002800705 becomes 223002800705. This reached the live
// donate page once; the warning is how anyone finds out.

describe("numeric identifier cells", () => {
  const rowsFor = (key: string, value: unknown) => [[key, value]];

  async function loadWith(rows: unknown[][]) {
    vi.resetModules();
    const readRange = vi.fn().mockResolvedValue(rows);
    vi.doMock("@/lib/sheets", () => ({ readRange }));
    process.env.CONTENT_SHEET_ID = "test-sheet";
    return import("@/lib/content");
  }

  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockRestore();
    vi.doUnmock("@/lib/sheets");
  });

  it("warns when an account number arrives as a number", async () => {
    const { getContent } = await loadWith(
      rowsFor("payment.bank.account_number", 223002800705)
    );
    await getContent();
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining("payment.bank.account_number")
    );
  });

  it("still publishes the value rather than blanking it", async () => {
    // Blanking would hide a correct number as readily as a truncated one, and
    // a contact page with no number is its own failure. contact.phone has no
    // confirmed value to compare against — PMAFI has never supplied one — so
    // there is nothing to restore and the warning is all this can do.
    const { getContent } = await loadWith(rowsFor("contact.phone", 9173270229));
    const content = await getContent();
    expect(content.contact.phone).toBe("9173270229");
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("contact.phone"));
  });

  it("stays quiet when the cell is text, which is the fix", async () => {
    const { getContent } = await loadWith(
      rowsFor("payment.bank.account_number", "022-3-002800705")
    );
    const content = await getContent();
    expect(content.payment.bankAccountNumber).toBe("022-3-002800705");
    expect(warn).not.toHaveBeenCalled();
  });

  it("warns for a GCash number too — every PH mobile begins 09", async () => {
    const { getContent } = await loadWith(rowsFor("payment.gcash.number", 9173270229));
    await getContent();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("payment.gcash.number"));
  });

  it("ignores a numeric cell that is not an identifier", async () => {
    const { getContent } = await loadWith(rowsFor("dues.regular", 3000));
    await getContent();
    expect(warn).not.toHaveBeenCalled();
  });
});

// --- Restoring a leading zero the sheet has eaten ---------------------------

describe("pickIdentifier", () => {
  async function loadWith(rows: unknown[][]) {
    vi.resetModules();
    const readRange = vi.fn().mockResolvedValue(rows);
    vi.doMock("@/lib/sheets", () => ({ readRange }));
    process.env.CONTENT_SHEET_ID = "test-sheet";
    return import("@/lib/content");
  }

  let warn: ReturnType<typeof vi.spyOn>;
  beforeEach(() => {
    warn = vi.spyOn(console, "warn").mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockRestore();
    vi.doUnmock("@/lib/sheets");
  });

  it("restores the confirmed number when the sheet lost its leading zero", async () => {
    // This is the live sheet's actual state: 0223002800705 stored numerically.
    const { getContent } = await loadWith([
      ["payment.bank.account_number", 223002800705],
    ]);
    const content = await getContent();
    expect(content.payment.bankAccountNumber).toBe("022-3-002800705");
  });

  it("lets a genuinely different account in the sheet win", async () => {
    // The day PMAFI moves banks, the sheet must override without a deploy —
    // that is the entire reason these details live in a sheet.
    const { getContent } = await loadWith([
      ["payment.bank.account_number", "111-2-003456789"],
    ]);
    const content = await getContent();
    expect(content.payment.bankAccountNumber).toBe("111-2-003456789");
    expect(warn).not.toHaveBeenCalled();
  });

  it("stops firing once the cell is text, so the sheet is authoritative again", async () => {
    const { getContent } = await loadWith([
      ["payment.bank.account_number", "022-3-002800705"],
    ]);
    const content = await getContent();
    expect(content.payment.bankAccountNumber).toBe("022-3-002800705");
    expect(warn).not.toHaveBeenCalled();
  });

  it("restores a GCash number too", async () => {
    const { getContent } = await loadWith([["payment.gcash.number", 9173270229]]);
    const content = await getContent();
    expect(content.payment.gcashNumber).toBe("09173270229");
  });

  it("publishes the confirmed details when the sheet is unreachable", async () => {
    vi.resetModules();
    vi.doMock("@/lib/sheets", () => ({
      readRange: vi.fn().mockRejectedValue(new Error("boom")),
    }));
    process.env.CONTENT_SHEET_ID = "test-sheet";
    const { getContent, hasPaymentDetails } = await import("@/lib/content");
    const content = await getContent();
    expect(hasPaymentDetails(content)).toBe(true);
    expect(content.payment.bankAccountNumber).toBe("022-3-002800705");
    expect(content.dues.regular).toBe("₱3,000 one-time");
  });
});

// --- Money cells ------------------------------------------------------------

describe("pickMoney", () => {
  async function loadWith(rows: unknown[][]) {
    vi.resetModules();
    const readRange = vi.fn().mockResolvedValue(rows);
    vi.doMock("@/lib/sheets", () => ({ readRange }));
    process.env.CONTENT_SHEET_ID = "test-sheet";
    return import("@/lib/content");
  }
  afterEach(() => vi.doUnmock("@/lib/sheets"));

  it("gives a bare number its currency back", async () => {
    // What staff actually type. It rendered as "3000" beside a bank account —
    // unmistakably a quantity, with nothing to say of what.
    const { getContent } = await loadWith([["dues.regular", 3000]]);
    const content = await getContent();
    expect(content.dues.regular).toBe("₱3,000");
  });

  it("leaves staff wording alone", async () => {
    // The cell is free text so PMAFI controls the phrasing, not just the figure.
    const { getContent } = await loadWith([
      ["dues.regular", "₱3,000 one-time"],
      ["dues.associate", "By arrangement"],
    ]);
    const content = await getContent();
    expect(content.dues.regular).toBe("₱3,000 one-time");
    expect(content.dues.associate).toBe("By arrangement");
  });

  it("falls back when the cell is empty", async () => {
    const { getContent } = await loadWith([["dues.regular", ""]]);
    const content = await getContent();
    expect(content.dues.regular).toBe("₱3,000 one-time");
  });
});
