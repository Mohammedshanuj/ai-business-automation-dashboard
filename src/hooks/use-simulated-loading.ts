import { useEffect, useState } from "react";

// Mimics network latency so skeleton states are visible with mock data.
// Replace with real query loading state when the backend is connected.
export function useSimulatedLoading(ms = 450) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}
