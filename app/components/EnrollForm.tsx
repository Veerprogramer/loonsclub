"use client";

import { useActionState, useState, type ChangeEvent, type FormEvent } from "react";
import { enroll, type EnrollState } from "../actions";
import {
  ENROLL_FIELDS,
  validateAll,
  validateField,
  type EnrollErrors,
  type EnrollField,
} from "../lib/enroll";

const initialValues: Record<EnrollField, string> = {
  studentName: "",
  parentName: "",
  email: "",
  phone: "",
  school: "",
  grade: "",
  terms: "",
};

const GRADES = ["6", "7", "8", "9", "10", "11", "12"];

const inputBase =
  "mt-2 block w-full rounded-xl border bg-cream/40 px-4 py-3.5 text-base text-ink placeholder:text-muted/50 outline-none transition hover:border-ink/40 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15";

export default function EnrollForm() {
  const [state, formAction, pending] = useActionState<EnrollState, FormData>(enroll, {
    status: "idle",
  });
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState<Partial<Record<EnrollField, boolean>>>({});
  const [clientErrors, setClientErrors] = useState<EnrollErrors>({});

  const serverErrors = state.status === "error" ? state.errors : {};
  const errorFor = (f: EnrollField) => (touched[f] ? clientErrors[f] : undefined) ?? serverErrors[f];

  function update(field: EnrollField, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (touched[field]) setClientErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  }

  function onChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const field = e.target.name as EnrollField;
    const value =
      e.target instanceof HTMLInputElement && e.target.type === "checkbox"
        ? e.target.checked
          ? "on"
          : ""
        : e.target.value;
    update(field, value);
    if (field === "terms" || field === "grade") blur(field, value);
  }

  function blur(field: EnrollField, value = values[field]) {
    setTouched((t) => ({ ...t, [field]: true }));
    setClientErrors((e) => ({ ...e, [field]: validateField(field, value) }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    const errors = validateAll(values);
    if (Object.keys(errors).length > 0) {
      e.preventDefault();
      setTouched(Object.fromEntries(ENROLL_FIELDS.map((f) => [f, true])));
      setClientErrors(errors);
      const first = ENROLL_FIELDS.find((f) => errors[f]);
      if (first) e.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
    }
  }

  if (state.status === "success") {
    return (
      <div className="rise rounded-3xl bg-white p-6 shadow-[0_30px_70px_-30px_rgba(29,23,41,0.3)] ring-1 ring-ink/5 sm:p-10">
        <div className="flex h-12 w-12 items-center justify-center bg-accent-gradient rounded-full text-white">
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h3 className="mt-6 font-display text-3xl font-semibold tracking-tight">
          You&apos;re in, {state.studentName.split(" ")[0]}.
        </h3>
        <p className="mt-3 text-muted">
          We&apos;ve reserved a seat. A confirmation will be sent to{" "}
          <span className="font-medium text-ink">{state.email}</span> once payment is complete.
        </p>
        <p className="mt-4 text-sm text-muted">
          Reference: <span className="font-mono text-ink">{state.orderId}</span>
        </p>
        {state.paymentUrl ? (
          <a
            href={state.paymentUrl}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)] transition hover:-translate-y-0.5 hover:brightness-110"
          >
            Continue to secure payment
            <span aria-hidden>→</span>
          </a>
        ) : (
          <p className="mt-8 rounded-xl bg-sand px-4 py-3 text-sm text-muted">
            Payment link not configured. Set <code className="font-mono">PAYMENT_URL</code> to your hosted
            checkout page.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
        action={formAction}
        onSubmit={onSubmit}
        noValidate
        className="rounded-3xl bg-white p-6 shadow-[0_30px_70px_-30px_rgba(29,23,41,0.3)] ring-1 ring-ink/5 sm:p-10"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label="Student name" name="studentName" error={errorFor("studentName")}>
            <input
              id="studentName"
              name="studentName"
              autoComplete="name"
              placeholder="Aarav Krishnan"
              value={values.studentName}
              onChange={onChange}
              onBlur={() => blur("studentName")}
              aria-invalid={!!errorFor("studentName")}
              aria-describedby="studentName-error"
              className={`${inputBase} ${errorFor("studentName") ? "border-danger" : "border-ink/15"}`}
            />
          </Field>
          <Field label="Parent name" name="parentName" error={errorFor("parentName")}>
            <input
              id="parentName"
              name="parentName"
              placeholder="Lakshmi Krishnan"
              value={values.parentName}
              onChange={onChange}
              onBlur={() => blur("parentName")}
              aria-invalid={!!errorFor("parentName")}
              aria-describedby="parentName-error"
              className={`${inputBase} ${errorFor("parentName") ? "border-danger" : "border-ink/15"}`}
            />
          </Field>
          <Field label="Email" name="email" error={errorFor("email")}>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="parent@email.com"
              value={values.email}
              onChange={onChange}
              onBlur={() => blur("email")}
              aria-invalid={!!errorFor("email")}
              aria-describedby="email-error"
              className={`${inputBase} ${errorFor("email") ? "border-danger" : "border-ink/15"}`}
            />
          </Field>
          <Field label="Phone" name="phone" error={errorFor("phone")}>
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              placeholder="+91 98765 43210"
              value={values.phone}
              onChange={onChange}
              onBlur={() => blur("phone")}
              aria-invalid={!!errorFor("phone")}
              aria-describedby="phone-error"
              className={`${inputBase} ${errorFor("phone") ? "border-danger" : "border-ink/15"}`}
            />
          </Field>
          <Field label="School" name="school" error={errorFor("school")}>
            <input
              id="school"
              name="school"
              autoComplete="organization"
              placeholder="Your school's name"
              value={values.school}
              onChange={onChange}
              onBlur={() => blur("school")}
              aria-invalid={!!errorFor("school")}
              aria-describedby="school-error"
              className={`${inputBase} ${errorFor("school") ? "border-danger" : "border-ink/15"}`}
            />
          </Field>
          <Field label="Class" name="grade" error={errorFor("grade")}>
            <select
              id="grade"
              name="grade"
              value={values.grade}
              onChange={onChange}
              onBlur={() => blur("grade")}
              aria-invalid={!!errorFor("grade")}
              aria-describedby="grade-error"
              className={`${inputBase} appearance-none pr-12 ${values.grade ? "" : "text-muted/50!"} ${
                errorFor("grade") ? "border-danger" : "border-ink/15"
              }`}
            >
              <option value="" disabled>
                Select class
              </option>
              {GRADES.map((g) => (
                <option key={g} value={g} className="text-ink">
                  Class {g}
                </option>
              ))}
            </select>
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="pointer-events-none absolute right-4 bottom-4 h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Field>
        </div>

        <div className="mt-8">
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <input
              type="checkbox"
              name="terms"
              checked={values.terms === "on"}
              onChange={onChange}
              aria-invalid={!!errorFor("terms")}
              aria-describedby="terms-error"
              className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer accent-accent"
            />
            <span>
              I agree to the{" "}
              <a href="#" className="font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent hover:decoration-accent">
                program terms
              </a>{" "}
              and{" "}
              <a href="#" className="font-medium text-ink underline decoration-accent/40 underline-offset-4 hover:text-accent hover:decoration-accent">
                privacy policy
              </a>
              , and confirm I am the student&apos;s parent or guardian.
            </span>
          </label>
          <ErrorText id="terms-error" message={errorFor("terms")} />
        </div>

        <button
          type="submit"
          disabled={pending}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
        >
          {pending ? "Reserving your seat…" : "Enroll and pay"}
          {!pending && <span aria-hidden>→</span>}
        </button>
        <p className="mt-4 text-center text-xs text-muted">
          You&apos;ll be taken to our secure payment partner to complete checkout.
        </p>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: EnrollField;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-sm font-medium text-ink">
        {label}
      </label>
      <div className="relative">{children}</div>
      <ErrorText id={`${name}-error`} message={error} />
    </div>
  );
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role={message ? "alert" : undefined} className="mt-2 min-h-5 text-sm text-danger">
      {message}
    </p>
  );
}
