import type { ReactNode } from "react";

import { SectionCard } from "@/components/common/SectionCard";

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function ChartCard({ title, description, children }: ChartCardProps) {
  return (
    <SectionCard title={title} description={description}>
      {children}
    </SectionCard>
  );
}
