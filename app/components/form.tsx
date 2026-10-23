// Building blocks shared by the enrollment and partnership forms

export const inputBase =
  "mt-2 block w-full rounded-xl border bg-cream/40 px-4 py-3.5 text-base text-ink placeholder:text-muted/50 outline-none transition hover:border-ink/40 focus:border-accent focus:bg-white focus:ring-4 focus:ring-accent/15";

export const inputBorder = (error?: string) => (error ? "border-danger" : "border-ink/15");

export function Field({
  label,
  id,
  error,
  hint,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
        {label}
        {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      </label>
      <div className="relative">{children}</div>
      <ErrorText id={`${id}-error`} message={error} />
    </div>
  );
}

export function ErrorText({ id, message }: { id: string; message?: string }) {
  return (
    <p id={id} role={message ? "alert" : undefined} className="mt-2 min-h-5 text-sm text-danger">
      {message}
    </p>
  );
}

export function SubmitButton({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-accent-gradient px-6 py-4 text-base font-semibold text-white shadow-[0_14px_30px_-12px_rgba(124,58,237,0.7)] transition hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
    >
      {pending && <span aria-hidden className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
      {pending ? pendingLabel : label}
      {!pending && (
        <span aria-hidden className="transition-transform group-hover:translate-x-1">
          →
        </span>
      )}
    </button>
  );
}

// A tick that draws itself inside a ring that ripples out, for success states
export function SuccessMark() {
  return (
    <div className="relative flex h-14 w-14 items-center justify-center">
      <span aria-hidden className="ripple absolute inset-0 rounded-full ring-2 ring-accent" />
      <span className="bg-accent-gradient flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_0_0_8px_rgba(124,58,237,0.12),0_14px_30px_-10px_rgba(124,58,237,0.7)]">
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.25">
          <path d="M5 12.5l4.5 4.5L19 7.5" strokeLinecap="round" strokeLinejoin="round" className="draw-tick" />
        </svg>
      </span>
    </div>
  );
}
