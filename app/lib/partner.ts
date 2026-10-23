// School partnership enquiry. Shared by the client (inline validation) and the server action.

export const PARTNER_FIELDS = ["schoolName", "principalName", "email", "phone"] as const;

export type PartnerField = (typeof PARTNER_FIELDS)[number];
export type PartnerErrors = Partial<Record<PartnerField, string>>;

// Optional: which programs the school is curious about
export const PARTNER_INTERESTS = ["Startup Bootcamp", "Becoming Entrepreneurial", "Not sure yet"] as const;

export function validatePartnerField(field: PartnerField, value: string): string | undefined {
  const v = value.trim();
  switch (field) {
    case "schoolName":
      return v.length < 2 ? "Enter your school's name." : undefined;
    case "principalName":
      return v.length < 2 ? "Enter the principal's name." : undefined;
    case "email":
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? undefined : "Enter a valid email address.";
    case "phone":
      return v.replace(/\D/g, "").length < 10 ? "Enter a phone number with at least 10 digits." : undefined;
  }
}

export function validatePartner(data: Record<PartnerField, string>): PartnerErrors {
  const errors: PartnerErrors = {};
  for (const f of PARTNER_FIELDS) {
    const msg = validatePartnerField(f, data[f]);
    if (msg) errors[f] = msg;
  }
  return errors;
}
