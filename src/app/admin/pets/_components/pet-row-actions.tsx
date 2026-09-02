'use client';

import { lazy, Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleDollarSign, Images, Info, MoreHorizontal, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getPetBaseInfoAction,
  getPetFormOptionsAction,
  getPetImagesAction,
  getPetPriceAction,
} from '@/entities/pets/pets.actions';
import { submitDeletePet } from '@/entities/pets/pets.client';
import { useCommonStore } from '@/stores/common.store';

import type {
  PetFormOptionsRequest,
  PetSection,
  PetSectionRequest,
} from './pet-section-dialog.types';

const LazyPetSectionDialog = lazy(async () => ({
  default: (await import('./pet-section-dialog')).PetSectionDialog,
}));
type DialogState = {
  section: PetSection;
  request: PetSectionRequest;
  optionsRequest: PetFormOptionsRequest;
} | null;
type Props = { petId: string; petTitle: string; disabled?: boolean };

export function PetRowActions({ petId, petTitle, disabled = false }: Props) {
  const router = useRouter();
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const [dialog, setDialog] = useState<DialogState>(null);

  function open(section: PetSection) {
    if (disabled) return;
    const request =
      section === 'base-info'
        ? getPetBaseInfoAction({ id: petId })
        : section === 'price'
          ? getPetPriceAction({ id: petId })
          : getPetImagesAction({ id: petId });
    setDialog({
      section,
      request: request as PetSectionRequest,
      optionsRequest: getPetFormOptionsAction(),
    });
  }

  function remove() {
    if (disabled) return;
    showConfirmDialog({
      title: 'حیوان حذف شود؟',
      message: `«${petTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2,
      variant: 'error',
      onSuccess: async () => {
        if (await submitDeletePet(petId)) router.refresh();
      },
    });
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          disabled={disabled}
          render={
            <Button
              type="button"
              iconOnly
              size="sm"
              variant="flat"
              color="secondary"
              aria-label={`عملیات ${petTitle}`}
            />
          }
        >
          <MoreHorizontal aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => open('base-info')}>
              <Info aria-hidden="true" />
              مشاهده و ویرایش اطلاعات اصلی
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => open('price')}>
              <CircleDollarSign aria-hidden="true" />
              مشاهده و ویرایش قیمت
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => open('images')}>
              <Images aria-hidden="true" />
              مشاهده و ویرایش تصاویر
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={remove}>
              <Trash2 aria-hidden="true" />
              حذف حیوان
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialog ? (
        <Suspense fallback={null}>
          <LazyPetSectionDialog
            petId={petId}
            petTitle={petTitle}
            section={dialog.section}
            request={dialog.request}
            optionsRequest={dialog.optionsRequest}
            onClose={() => setDialog(null)}
            onUpdated={() => {
              setDialog(null);
              router.refresh();
            }}
          />
        </Suspense>
      ) : null}
    </>
  );
}
