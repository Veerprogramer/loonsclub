"use server";

import { ENROLL_FIELDS, validateAll, type EnrollErrors, type EnrollField } from "./lib/enroll";

export type EnrollState =
  | { status: "idle" }
  | { status: "error"; errors: EnrollErrors }
  | {
      status: "success";
      orderId: string;
      studentName: string;
      email: string;
      paymentUrl: string | null;
    };

export async function enroll(_prev: EnrollState, formData: FormData): Promise<EnrollState> {
  const data = Object.fromEntries(
    ENROLL_FIELDS.map((f) => [f, String(formData.get(f) ?? "")]),
  ) as Record<EnrollField, string>;

  const errors = validateAll(data);
  if (Object.keys(errors).length > 0) return { status: "error", errors };

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
    paymentUrl,
  };
}
