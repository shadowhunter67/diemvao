import type { ReactNode } from 'react';

interface DashboardHeroProps {
  scoreCard: ReactNode;
  programCard: ReactNode;
}

export function DashboardHero({ scoreCard, programCard }: DashboardHeroProps) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 sm:grid-cols-2 lg:grid-cols-1">
      {scoreCard}
      {programCard}
    </div>
  );
}
