"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/app/actions/auth";
import { loginInputSchema, type LoginFormValues } from "@/lib/validation/auth";

/** How long a pending request may run before we explain the free-tier cold start. */
const COLD_START_HINT_MS = 5_000;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  const [formError, setFormError] = useState<string | null>(null);
  const [hasBeenSlow, setHasBeenSlow] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginInputSchema),
    mode: "onSubmit",
    defaultValues: { phone: "", name: "" },
  });

  // Derived rather than stored, so there's no setState in an effect body just to
  // reset it when submission ends.
  const isSlow = isSubmitting && hasBeenSlow;

  /**
   * The API sleeps on Render's free tier, so the first sign-in of the day can take
   * 30–50s. A spinner that long reads as broken, so past five seconds we say what is
   * actually happening.
   */
  useEffect(() => {
    if (!isSubmitting) return;

    const timer = setTimeout(() => setHasBeenSlow(true), COLD_START_HINT_MS);
    return () => {
      clearTimeout(timer);
      setHasBeenSlow(false);
    };
  }, [isSubmitting]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);

    // On success this never returns — the Server Action redirects, which throws.
    // Anything that comes back is a failure to render.
    const result = await login(values, next);

    if (result && result.ok === false) {
      if (result.fieldErrors) {
        for (const [field, message] of Object.entries(result.fieldErrors)) {
          if (message) {
            setError(field as keyof LoginFormValues, { type: "server", message });
          }
        }
      }

      // Field-level errors are already visible inline; only surface a toast for
      // failures the form itself can't explain.
      const hasFieldErrors =
        result.fieldErrors && Object.keys(result.fieldErrors).length > 0;

      if (!hasFieldErrors) {
        setFormError(result.message);
        toast.error(result.message);
      }
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-neutral-950">
          Sign in
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Enter your phone number and name. If you haven&apos;t used this number
          before, we&apos;ll create your account automatically.
        </p>
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-neutral-800">
            Phone number
          </Label>
          <Input
            id="phone"
            {...register("phone")}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+8801700000000"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
            className="h-11 px-3.5 text-base"
          />
          {errors.phone ? (
            <p id="phone-error" role="alert" className="text-xs text-red-600">
              {errors.phone.message}
            </p>
          ) : (
            <p id="phone-hint" className="text-xs text-neutral-400">
              Include the country code. Spaces and dashes are fine.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="name" className="text-neutral-800">
            Your name
          </Label>
          <Input
            id="name"
            {...register("name")}
            autoComplete="name"
            placeholder="Aminul Islam"
            disabled={isSubmitting}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="h-11 px-3.5 text-base"
          />
          {errors.name && (
            <p id="name-error" role="alert" className="text-xs text-red-600">
              {errors.name.message}
            </p>
          )}
        </div>
      </div>

      {formError && (
        <p
          role="alert"
          className="mt-5 rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-xs leading-relaxed text-red-700"
        >
          {formError}
        </p>
      )}

      <Button
        type="submit"
        size="lg"
        disabled={isSubmitting}
        className="mt-7 h-12 w-full gap-2 text-sm font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Signing in
          </>
        ) : (
          <>
            Continue
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>

      {/* Reserve the row so the hint appearing doesn't shift the layout. */}
      <div className="mt-3 min-h-8">
        {isSlow && (
          <p
            aria-live="polite"
            className="text-center text-xs leading-relaxed text-neutral-500"
          >
            The demo API sleeps when idle — waking it up can take up to 30
            seconds. Hang tight.
          </p>
        )}
      </div>
    </form>
  );
}
