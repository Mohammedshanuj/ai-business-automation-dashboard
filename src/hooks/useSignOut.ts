import { useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import { useAuth } from "@/context/AuthContext";

export function useSignOut() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = useCallback(async () => {
    setIsSigningOut(true);
    try {
      const error = await signOut();
      if (error) {
        setIsSigningOut(false);
        return;
      }
      void navigate({ to: "/login", replace: true });
    } catch {
      setIsSigningOut(false);
    }
  }, [signOut, navigate]);

  return { signOut: handleSignOut, isSigningOut };
}
