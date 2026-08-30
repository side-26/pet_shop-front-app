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
  deletePetTypeAction,
  getPetTypeByIdAction,
  getPetTypePropertyDefinitionsAction,
} from '@/entities/pet-types/pet-types.actions';
import { useCommonStore } from '@/stores/common.store';
import { globalErrorHandler } from '@/utils/helpers';

const LazyPetTypeDetailDialog = lazy(async () => {
  const dialog = await import('./pet-type-detail-dialog');

  return { default: dialog.PetTypeDetailDialog };
});
const LazyPetTypePropertyDefinitionsDialog = lazy(async () => {
  const dialog = await import('./pet-type-property-definitions-dialog');

  return { default: dialog.PetTypePropertyDefinitionsDialog };
});

type PetTypeDetailRequest = ReturnType<typeof getPetTypeByIdAction>;

type PetTypeRowActionsProps = {
  petTypeId: string;
  petTypeTitle: string;
  disabled?: boolean;
};

export function PetTypeRowActions({
  petTypeId,
  petTypeTitle,
  disabled = false,
}: PetTypeRowActionsProps) {
  const router = useRouter();
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const [detailRequest, setDetailRequest] = useState<PetTypeDetailRequest | null>(null);
  const [propertyDefinitionsOpen, setPropertyDefinitionsOpen] = useState(false);

  function openDetail() {
    if (disabled) return;
    setDetailRequest(getPetTypeByIdAction({ id: petTypeId }));
  }

  function openPropertyDefinitions() {
    if (disabled) return;
    setPropertyDefinitionsOpen(true);
  }

  function confirmDeletion() {
    if (disabled) return;

    showConfirmDialog({
      title: 'نوع حیوان حذف شود؟',
      message: `نوع حیوان «${petTypeTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      variant: 'error',
      onSuccess: async () => {
        const result = await deletePetTypeAction({ id: petTypeId });

        if (!result.isSuccess) {
          globalErrorHandler(result);
          return;
        }

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
              aria-label={`عملیات ${petTypeTitle}`}
            />
          }
        >
          <MoreHorizontalIcon aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={openDetail}>
              <EyeIcon aria-hidden="true" />
              مشاهده و ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem onClick={openPropertyDefinitions}>
              <ListPlusIcon aria-hidden="true" />
              ویرایش ویژگی‌های اضافی
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={confirmDeletion}>
              <Trash2Icon aria-hidden="true" />
              حذف نوع حیوان
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {detailRequest ? (
        <Suspense fallback={null}>
          <LazyPetTypeDetailDialog
            request={detailRequest}
            onClose={() => setDetailRequest(null)}
            onUpdated={() => {
              setDetailRequest(null);
              router.refresh();
            }}
          />
        </Suspense>
      ) : null}
      {propertyDefinitionsOpen ? (
        <Suspense fallback={null}>
          <LazyPetTypePropertyDefinitionsDialog
            petTypeId={petTypeId}
            onClose={() => setPropertyDefinitionsOpen(false)}
            onUpdated={() => {
              setPropertyDefinitionsOpen(false);
              router.refresh();
            }}
          />
        </Suspense>
      ) : null}
    </>
  );
}
