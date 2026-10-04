import { createFileRoute } from "@tanstack/react-router";
import { Info, LogOut, Palette, ShieldCheck, UserRound } from "lucide-react";
import type { ReactNode } from "react";

import { ToneBadge } from "@/components/common/badges";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { UserAvatar } from "@/components/layout/UserAvatar";
import { ThemeSegmentedControl } from "@/components/theme/ThemeSegmentedControl";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useSignOut } from "@/hooks/useSignOut";
import { useUserIdentity } from "@/hooks/useUserIdentity";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — AI Business Operations Dashboard" },
      { name: "description", content: "Account details and session for the operations dashboard." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { user } = useAuth();
  const { identity } = useUserIdentity();
  const { signOut, isSigningOut } = useSignOut();
  const { theme, resolvedTheme } = useTheme();

  const lastSignIn = user?.last_sign_in_at
    ? new Date(user.last_sign_in_at).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <DashboardLayout title="Settings">
      <div className="mx-auto max-w-3xl space-y-6">
        <PageHeader title="Settings" subtitle="Your account, appearance, and session details." />

        <SectionCard
          title="Account"
          description="Identity from your sign-in provider."
          icon={UserRound}
        >
          <div className="space-y-5">
            <div className="flex items-center gap-4 rounded-lg border border-border bg-surface-muted p-4">
              <UserAvatar className="h-12 w-12 text-sm" />
              <div className="min-w-0">
                <p className="truncate text-base font-semibold text-foreground">
                  {identity?.displayName}
                </p>
                <p className="truncate text-sm text-muted-foreground">{identity?.email}</p>
              </div>
            </div>
            <dl className="divide-y divide-border">
              <Field label="Display name">{identity?.displayName}</Field>
              <Field label="Email">{identity?.email || "—"}</Field>
            </dl>
          </div>
        </SectionCard>

        <SectionCard
          title="Appearance"
          description="Choose how the dashboard looks on this device."
          icon={Palette}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Theme</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {theme === "system"
                  ? `Following your system setting (currently ${resolvedTheme}).`
                  : `Always use ${theme} mode.`}
              </p>
            </div>
            <ThemeSegmentedControl className="w-full sm:w-auto" />
          </div>
        </SectionCard>

        <SectionCard title="Security" icon={ShieldCheck}>
          <div className="space-y-5">
            <dl className="divide-y divide-border">
              <Field label="Status">
                <ToneBadge tone="success" dot>
                  Signed in
                </ToneBadge>
              </Field>
              {lastSignIn && <Field label="Last sign-in">{lastSignIn}</Field>}
            </dl>
            <div className="border-t border-border pt-5">
              <Button
                variant="outline"
                loading={isSigningOut}
                onClick={() => {
                  void signOut();
                }}
              >
                {!isSigningOut && <LogOut aria-hidden="true" />}
                {isSigningOut ? "Signing out…" : "Log out"}
              </Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Application" icon={Info}>
          <p className="text-sm font-medium text-foreground">AI Business Operations Dashboard</p>
          <p className="mt-1 text-sm text-muted-foreground">
            AI-scored leads and AI-triaged support tickets with human-in-the-loop review.
          </p>
        </SectionCard>

        <SectionCard title="About" icon={Info}>
          <p className="text-sm font-medium text-foreground">AI Business Operations Dashboard</p>
          <p className="mt-1 text-sm text-muted-foreground">Built by Shanuj</p>
          <p className="mt-1 text-sm text-muted-foreground">Version 1.0.0</p>
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-3 first:pt-0 last:pb-0 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 truncate text-sm font-medium text-foreground">{children}</dd>
    </div>
  );
}
