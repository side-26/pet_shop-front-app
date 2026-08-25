'use client';

import { useRef, useState } from 'react';
import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';

import type { PetListDialogHandle, PetListDialogKind } from './pet-list-dialog';

const LazyPetListDialog = dynamic(() =>
  import('./pet-list-dialog').then((module) => module.PetListDialog),
);

export function MobilePetTools() {
  const dialogRef = useRef<PetListDialogHandle>(null);
  const [activeDialog, setActiveDialog] = useState<PetListDialogKind>();

  function toggleDialog(kind: PetListDialogKind) {
    if (activeDialog === kind && dialogRef.current) dialogRef.current.toggle();
    else setActiveDialog(kind);
  }

  return (
    <>
      <div className="tw:sticky tw:top-20 tw:z-20 tw:grid tw:grid-cols-2 tw:gap-2 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-background/90 tw:p-2 tw:shadow-lg tw:shadow-foreground/5 tw:supports-backdrop-filter:backdrop-blur-xl tw:lg:hidden">
        <Button variant="tonal" color="secondary" block onClick={() => toggleDialog('filters')}>
          <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
          فیلترها
        </Button>
        <Button variant="outlined" block onClick={() => toggleDialog('sorting')}>
          <ArrowDownUp data-icon="inline-start" aria-hidden="true" />
          مرتب‌سازی
        </Button>
      </div>
      {activeDialog ? (
        <LazyPetListDialog key={activeDialog} ref={dialogRef} kind={activeDialog} openOnMount />
      ) : null}
    </>
  );
}
