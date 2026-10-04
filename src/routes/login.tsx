import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground">
            <Zap className="h-6 w-6" />
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-foreground">
            AI Business Operations
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your operations dashboard
          </p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                navigate({ to: "/" });
              }}
            >
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@company.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" placeholder="••••••••" required />
              </div>
              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Internal platform for authorized team members. Authentication will be enabled with the
          production backend.
        </p>
      </div>
    </div>
  );
}
