"use server";

import { ENROLL_FIELDS, validateAll, type EnrollErrors, type EnrollField } from "./lib/enroll";
import {
  PARTNER_FIELDS,
  PARTNER_INTERESTS,
  validatePartner,
  type PartnerErrors,
  type PartnerField,
} from "./lib/partner";

export type EnrollState =
  | { status: "idle" }
  | { status: "error"; errors: EnrollErrors }
  | {
      status: "success";
      orderId: string;
      studentName: string;
      email: string;
      program: string | null;
      paymentUrl: string | null;
    };

export async function enroll(_prev: EnrollState, formData: FormData): Promise<EnrollState> {
  const data = Object.fromEntries(
    ENROLL_FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<EnrollField, string>;

  const errors = validateAll(data);
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  // Set when the form was opened from a program page
  const program = String(formData.get("program") ?? "").trim() || null;

  // TODO: persist the enrollment (database, CRM, confirmation email) here.
  const orderId = `LC-${Date.now().toString(36).toUpperCase()}`;

  // Hosted payment page, e.g. a Stripe Payment Link. Set PAYMENT_URL in .env.local.
  let paymentUrl: string | null = null;
  if (process.env.PAYMENT_URL) {
    const url = new URL(process.env.PAYMENT_URL);
    url.searchParams.set("prefilled_email", data.email.trim());
    url.searchParams.set("client_reference_id", orderId);
    paymentUrl = url.toString();
  }

  return {
    status: "success",
    orderId,
    studentName: data.studentName.trim(),
    email: data.email.trim(),
    program,
    paymentUrl,
  };
}

export type PartnerState =
  | { status: "idle" }
  | { status: "error"; errors: PartnerErrors }
  | { status: "success"; schoolName: string; principalName: string; email: string; interests: string[] };

export async function partner(_prev: PartnerState, formData: FormData): Promise<PartnerState> {
  const data = Object.fromEntries(
    PARTNER_FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<PartnerField, string>;

  const errors = validatePartner(data);
  if (Object.keys(errors).length > 0) return { status: "error", errors };

  // Only keep interests we offer
  const interests = formData
    .getAll("interest")
    .map(String)
    .filter((i) => (PARTNER_INTERESTS as readonly string[]).includes(i));

  // TODO: persist the enquiry and notify the team (database, CRM, email to info@loonsclub.com) here.

  return {
    status: "success",
    schoolName: data.schoolName.trim(),
    principalName: data.principalName.trim(),
    email: data.email.trim(),
    interests,
  };
}
