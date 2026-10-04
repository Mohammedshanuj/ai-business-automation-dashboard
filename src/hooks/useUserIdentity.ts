import { useMemo } from "react";

import { useAuth } from "@/context/AuthContext";
import { getDisplayName, getInitials } from "@/lib/userDisplay";

export interface UserIdentity {
  displayName: string;
  email: string;
  initials: string;
}

export function useUserIdentity(): { identity: UserIdentity | null; loading: boolean } {
  const { user, loading } = useAuth();

  const identity = useMemo<UserIdentity | null>(() => {
    if (!user) return null;
    const displayName = getDisplayName(user);
    return { displayName, email: user.email ?? "", initials: getInitials(displayName) };
  }, [user]);

  return { identity, loading };
}
