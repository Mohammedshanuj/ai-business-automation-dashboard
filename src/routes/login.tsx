import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AlertCircle, Zap } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { AuthLoading } from "@/components/auth/AuthLoading";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — AI Business Operations Dashboard" },
      {
        name: "description",
        content:
          "Sign in to the AI Business Operations Dashboard for lead qualification and support triage.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && user) {
      void navigate({ to: "/", replace: true });
    }
  }, [loading, user, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setSubmitting(true);

    try {
      const error = await signIn(email.trim(), password);
      if (error) {
        setErrorMessage("Invalid email or password.");
        setSubmitting(false);
        return;
      }
      void navigate({ to: "/", replace: true });
    } catch {
      setErrorMessage("Unable to sign in. Try again.");
      setSubmitting(false);
    }
  }

  if (loading || user) {
    return <AuthLoading />;
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-auth-backdrop">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <ThemeToggle />
      </div>
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-md ring-1 ring-inset ring-primary-foreground/15">
              <Zap className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
              AI Business Operations
            </h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Sign in to your operations dashboard
            </p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6 sm:p-7">
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    className="h-10"
                    placeholder="you@company.com"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="h-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>
                {errorMessage ? (
                  <p
                    className="flex items-center gap-2 rounded-lg border border-danger-border bg-danger-soft px-3 py-2 text-sm text-danger"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {errorMessage}
                  </p>
                ) : null}
                <Button type="submit" size="lg" className="w-full" loading={submitting}>
                  {submitting ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Internal platform for authorized team members.
          </p>
        </div>
      </div>
      <p className="px-4 pb-4 pt-2 text-center text-xs text-muted-foreground">
        © 2026 Shanuj. All rights reserved.
      </p>
    </div>
  );
}
