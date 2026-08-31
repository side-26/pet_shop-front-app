'use client';

import { lazy, Suspense, useState } from 'react';
import { EyeIcon, ListPlusIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/toast';
import {
  deleteBreedAction,
  getBreedAction,
  getBreedPropertyDefinitionsAction,
} from '@/entities/breeds/breeds.actions';
import { useCommonStore } from '@/stores/common.store';
import { globalErrorHandler } from '@/utils/helpers';

import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';

const LazyBreedDetailDialog = lazy(async () => {
  const dialog = await import('./breed-detail-dialog');
  return { default: dialog.BreedDetailDialog };
});
const LazyBreedPropertyDefinitionsDialog = lazy(async () => {
  const dialog = await import('./breed-property-definitions-dialog');
  return { default: dialog.BreedPropertyDefinitionsDialog };
});

type DetailRequest = ReturnType<typeof getBreedAction>;
type PropertyDefinitionsRequest = ReturnType<typeof getBreedPropertyDefinitionsAction>;

type Props = {
  breedId: string;
  breedTitle: string;
  countries?: readonly BreedCountryOption[];
  petTypes: readonly BreedPetTypeOption[];
  disabled?: boolean;
};

export function BreedRowActions({
  breedId,
  breedTitle,
  countries = [],
  petTypes,
  disabled = false,
}: Props) {
  const router = useRouter();
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const [detailRequest, setDetailRequest] = useState<DetailRequest | null>(null);
  const [propertyDefinitionsRequest, setPropertyDefinitionsRequest] =
    useState<PropertyDefinitionsRequest | null>(null);

  function confirmDeletion() {
    if (disabled) return;
    showConfirmDialog({
      title: 'نژاد حذف شود؟',
      message: `نژاد «${breedTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      variant: 'error',
      onSuccess: async () => {
        const result = await deleteBreedAction({ id: breedId });
        if (!result.isSuccess) return globalErrorHandler(result);
        toast.add({ type: 'success', title: result.message });
        router.refresh();
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
              aria-label={`عملیات ${breedTitle}`}
            />
          }
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setDetailRequest(getBreedAction({ id: breedId }))}>
              <EyeIcon aria-hidden="true" />
              مشاهده و ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                setPropertyDefinitionsRequest(getBreedPropertyDefinitionsAction({ id: breedId }))
              }
            >
              <ListPlusIcon aria-hidden="true" />
              ویرایش ویژگی‌های اضافی
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={confirmDeletion}>
              <Trash2Icon aria-hidden="true" />
              حذف نژاد
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {detailRequest ? (
        <Suspense fallback={null}>
          <LazyBreedDetailDialog
            breedId={breedId}
            request={detailRequest}
            countries={countries}
            petTypes={petTypes}
            onClose={() => setDetailRequest(null)}
            onUpdated={() => {
              setDetailRequest(null);
              router.refresh();
            }}
          />
        </Suspense>
      ) : null}
      {propertyDefinitionsRequest ? (
        <Suspense fallback={null}>
          <LazyBreedPropertyDefinitionsDialog
            breedId={breedId}
            request={propertyDefinitionsRequest}
            onClose={() => setPropertyDefinitionsRequest(null)}
            onUpdated={() => {
              setPropertyDefinitionsRequest(null);
              router.refresh();
            }}
          />
        </Suspense>
      ) : null}
    </>
  );
}
