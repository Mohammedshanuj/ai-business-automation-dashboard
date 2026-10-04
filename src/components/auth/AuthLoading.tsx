import { Loader2 } from "lucide-react";

export function AuthLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background" role="status">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Loading…
      </p>
    </div>
  );
}
