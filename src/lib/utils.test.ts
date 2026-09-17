import { describe, it, expect } from "vitest";
import { slugify, priceLabel, normalizePhone } from "@/lib/utils";

describe("utils", () => {
  it("slugify", () => { expect(slugify("Denso Cabin Filter BR-V")).toBe("denso-cabin-filter-br-v"); });
  it("price FIXED", () => { expect(priceLabel({ price_mode: "FIXED", price: 750000 })).toContain("750"); });
  it("price CONTACT", () => { expect(priceLabel({ price_mode: "CONTACT" })).toBe("Hubungi kami"); });
  it("normalizePhone 08..", () => { expect(normalizePhone("0821-1190-6994")).toBe("6282111906994"); });
  it("normalizePhone +62", () => { expect(normalizePhone("+6282111906994")).toBe("6282111906994"); });
});
