import "server-only";
import { z } from "zod";
import { budgetOptions, contactLimits, needOptions, timingOptions } from "./contact";

const optionalEnum = <T extends readonly [string, ...string[]]>(values: T, message: string) =>
  z.union([z.literal(""), z.enum(values)], { error: message }).default("");

/** Server-side validation for /api/contact. Messages match validateContact in lib/contact.ts. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please enter your name.")
    .max(contactLimits.name, `Please keep your name under ${contactLimits.name} characters.`),
  email: z
    .string()
    .trim()
    .min(1, "Please enter your email so I can reply.")
    .max(contactLimits.email, "Please enter a valid email address.")
    .pipe(z.email("Please enter a valid email address.")),
  business: z
    .string()
    .trim()
    .max(contactLimits.business, `Please keep this under ${contactLimits.business} characters.`)
    .default(""),
  need: z.enum(needOptions, { message: "Please choose what you need." }),
  budget: optionalEnum(budgetOptions, "Please choose a budget range."),
  timing: optionalEnum(timingOptions, "Please choose a timing."),
  message: z
    .string()
    .trim()
    .min(contactLimits.messageMin, `Please write at least ${contactLimits.messageMin} characters so I understand the project.`)
    .max(contactLimits.messageMax, `Please keep the message under ${contactLimits.messageMax} characters.`),
  website: z.string().max(500).default(""),
  turnstileToken: z.string().max(4096).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
