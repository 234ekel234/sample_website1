import { describe, it, expect } from "vitest";
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
