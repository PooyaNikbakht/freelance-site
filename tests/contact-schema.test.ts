import { describe, expect, it } from "vitest";
import { validateContact } from "@/lib/contact";
import { contactSchema } from "@/lib/contact-schema";

const valid = {
  name: "Jane Doe",
  email: "jane@example.com",
  business: "Jane's Bakery",
  need: "A new website",
  budget: "$1,000 to $3,000",
  timing: "In the next month",
  message: "A new site for my bakery, with online orders.",
  website: "",
};

describe("contact schema", () => {
  it("accepts a valid message and trims fields", () => {
    const parsed = contactSchema.parse({ ...valid, name: "  Jane Doe  " });
    expect(parsed.name).toBe("Jane Doe");
    expect(parsed.need).toBe("A new website");
  });

  it("defaults the optional fields", () => {
    const parsed = contactSchema.parse({ name: "Jane", email: "jane@example.com", need: "Something else", message: "x".repeat(25) });
    expect(parsed).toMatchObject({ business: "", budget: "", timing: "", website: "" });
  });

  it("rejects bad input with the same messages as the browser checks", () => {
    const bad = { ...valid, name: "", email: "not-an-email", need: "A spaceship", budget: "Lots", message: "short" };
    const result = contactSchema.safeParse(bad);
    expect(result.success).toBe(false);
    const server = Object.fromEntries(result.error!.issues.map((i) => [String(i.path[0]), i.message]));
    const client = validateContact({ ...bad, timing: valid.timing });
    for (const key of ["name", "email", "need", "budget", "message"] as const) {
      expect(server[key]).toBe(client[key]);
    }
  });

  it("caps the message length", () => {
    expect(contactSchema.safeParse({ ...valid, message: "x".repeat(4001) }).success).toBe(false);
  });
});
