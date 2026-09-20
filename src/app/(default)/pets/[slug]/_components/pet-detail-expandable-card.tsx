'use client';

import type { ReactNode } from 'react';

import { CardHeader, CardTitle } from '@/components/ui/card';
import { ExpandableCard } from '@/components/ui/expandable-card';

type PetDetailExpandableCardProps = Readonly<{
  title: string;
  children: ReactNode;
  collapsedHeight: number;
  isSkeleton?: boolean;
}>;

/** Desktop detail presentation; mobile/tablet use the adjacent Drawer composition instead. */
export function PetDetailExpandableCard({
  title,
  children,
  collapsedHeight,
  isSkeleton = false,
}: PetDetailExpandableCardProps) {
  return (
    <ExpandableCard.Root variant="outlined" size="sm" className="tw:rounded-2xl">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <ExpandableCard.Content collapsedHeight={collapsedHeight}>{children}</ExpandableCard.Content>
      <ExpandableCard.Trigger
        disabled={isSkeleton}
        collapsedLabel={`نمایش ${title}`}
        expandedLabel={`بستن ${title}`}
      />
    </ExpandableCard.Root>
  );
}
