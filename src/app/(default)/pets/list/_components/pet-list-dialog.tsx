'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogAction,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { PetFilters } from './pet-filters';

const sortOptions = ['پیشنهاد ویژه', 'جدیدترین', 'کم‌سن‌ترین', 'ارزان‌ترین'] as const;

export type PetListDialogKind = 'filters' | 'sorting';
export type PetListDialogHandle = { open: () => void; close: () => void; toggle: () => void };

type PetListDialogProps = Readonly<{ kind: PetListDialogKind; openOnMount?: boolean }>;

export const PetListDialog = forwardRef<PetListDialogHandle, PetListDialogProps>(
  function PetListDialog({ kind, openOnMount = false }, ref) {
    const [open, setOpen] = useState(openOnMount);

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close: () => setOpen(false),
        toggle: () => setOpen((current) => !current),
      }),
      [],
    );

    const isFilters = kind === 'filters';
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          size={isFilters ? 'lg' : 'sm'}
          className="tw:h-dvh tw:max-h-dvh tw:w-full tw:max-w-none tw:grid-rows-[auto_minmax(0,1fr)_auto] tw:gap-0 tw:overflow-hidden tw:rounded-none tw:p-0 tw:md:h-[70dvh] tw:md:max-h-[70dvh] tw:md:max-w-lg tw:md:rounded-3xl"
        >
          <DialogHeader className="tw:border-b tw:border-border/60 tw:px-6 tw:py-5 tw:pe-16">
            <DialogTitle>{isFilters ? 'فیلتر حیوانات' : 'مرتب‌سازی حیوانات'}</DialogTitle>
            <DialogDescription>
              {isFilters
                ? 'نوع، سن و جنسیت حیوان را انتخاب کنید.'
                : 'ترتیب نمایش حیوانات را انتخاب کنید.'}
            </DialogDescription>
          </DialogHeader>

          <div
            data-testid="pet-dialog-scroll-area"
            className="tw:min-h-0 tw:overflow-y-auto tw:overscroll-contain tw:p-4 tw:md:p-6"
          >
            {isFilters ? (
              <PetFilters compact showAction={false} />
            ) : (
              <div className="tw:flex tw:flex-col tw:gap-2">
                {sortOptions.map((option, index) => (
                  <Button
                    key={option}
                    variant={index === 0 ? 'tonal' : 'flat'}
                    color={index === 0 ? 'primary' : 'secondary'}
                    block
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="tw:border-t tw:border-border/60 tw:px-6 tw:py-4">
            <DialogAction size="lg">{isFilters ? 'نمایش نتایج' : 'اعمال مرتب‌سازی'}</DialogAction>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
