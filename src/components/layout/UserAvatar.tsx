import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserIdentity } from "@/hooks/useUserIdentity";
import { cn } from "@/lib/utils";

export function UserAvatar({ className }: { className?: string }) {
  const { identity } = useUserIdentity();

  return (
    <Avatar className={cn("shrink-0", className)}>
      <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/15">
        {identity ? identity.initials : <Skeleton className="h-full w-full rounded-full" />}
      </AvatarFallback>
    </Avatar>
  );
}
