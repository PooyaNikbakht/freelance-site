// Options and limits shared by the contact form (client) and /api/contact (server).
// Kept free of zod so the client bundle stays small; the server schema lives in
// lib/contact-schema.ts.

export const needOptions = [
  "A new website",
  "Booking, ordering or quotes",
  "An AI assistant or AI feature",
  "Fix or improve my existing site",
  "An MVP or new product",
  "Something else",
] as const;

export const budgetOptions = ["Under US$1,000", "US$1,000 to US$3,000", "US$3,000 to US$10,000", "US$10,000+", "Not sure yet"] as const;

export const timingOptions = ["As soon as possible", "In the next month", "In 1 to 3 months", "Just exploring"] as const;

export const contactLimits = {
  name: 100,
  email: 200,
  business: 200,
  messageMin: 20,
  messageMax: 4000,
} as const;

export type ContactFields = {
  name: string;
  email: string;
  business: string;
  need: string;
  budget: string;
  timing: string;
  message: string;
  /** Honeypot. Real visitors never see or fill it. */
  website: string;
  turnstileToken?: string;
};

export type ContactFieldErrors = Partial<Record<"name" | "email" | "business" | "need" | "budget" | "timing" | "message", string>>;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Light client-side checks with the same rules and messages as the server schema. */
export function validateContact(f: ContactFields): ContactFieldErrors {
  const errors: ContactFieldErrors = {};
  const name = f.name.trim();
  const email = f.email.trim();
  const message = f.message.trim();
  if (!name) errors.name = "Please enter your name.";
  else if (name.length > contactLimits.name) errors.name = `Please keep your name under ${contactLimits.name} characters.`;
  if (!email) errors.email = "Please enter your email so I can reply.";
  else if (email.length > contactLimits.email || !emailPattern.test(email)) errors.email = "Please enter a valid email address.";
  if (f.business.trim().length > contactLimits.business)
    errors.business = `Please keep this under ${contactLimits.business} characters.`;
  if (!(needOptions as readonly string[]).includes(f.need)) errors.need = "Please choose what you need.";
  if (f.budget && !(budgetOptions as readonly string[]).includes(f.budget)) errors.budget = "Please choose a budget range.";
  if (f.timing && !(timingOptions as readonly string[]).includes(f.timing)) errors.timing = "Please choose a timing.";
  if (message.length < contactLimits.messageMin)
    errors.message = `Please write at least ${contactLimits.messageMin} characters so I understand the project.`;
  else if (message.length > contactLimits.messageMax)
    errors.message = `Please keep the message under ${contactLimits.messageMax} characters.`;
  return errors;
}
