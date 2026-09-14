'use client';

import type { ReactNode } from 'react';

import { ExpandableCard } from '@/components/ui/expandable-card';

type PetListDescriptionCardProps = Readonly<{ children: ReactNode }>;

/** Client-only interaction shell for the server-rendered pet-list SEO content. */
export function PetListDescriptionCard({ children }: PetListDescriptionCardProps) {
  return (
    <ExpandableCard.Root size="sm" variant="outlined" className="tw:rounded-2xl">
      <ExpandableCard.Content collapsedHeight={130} className="tw:flex tw:flex-col tw:gap-3">
        {children}
      </ExpandableCard.Content>
      <ExpandableCard.Trigger collapsedLabel="مشاهده بیشتر" expandedLabel="مشاهده کمتر" />
    </ExpandableCard.Root>
  );
}
