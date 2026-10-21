'use client';

import { useState } from 'react';
import { EyeIcon, ListPlusIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getPetTypeByIdAction,
  getPetTypePropertyDefinitionsAction,
} from '@/entities/pet-types/pet-types.actions';
import { useDeletePetType } from '@/entities/pet-types/pet-types.client';
import { useCommonStore } from '@/stores/common.store';

import { PetTypeDetailDialog } from './pet-type-detail-dialog';
import { PetTypePropertyDefinitionsDialog } from './pet-type-property-definitions-dialog';

type PetTypeDetailRequest = ReturnType<typeof getPetTypeByIdAction>;
type PetTypePropertyDefinitionsRequest = ReturnType<typeof getPetTypePropertyDefinitionsAction>;

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
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const { remove } = useDeletePetType(() => undefined);
  const [detailRequest, setDetailRequest] = useState<PetTypeDetailRequest | null>(null);
  const [propertyDefinitionsRequest, setPropertyDefinitionsRequest] =
    useState<PetTypePropertyDefinitionsRequest | null>(null);

  function openDetail() {
    if (disabled) return;
    setDetailRequest(getPetTypeByIdAction({ id: petTypeId }));
  }

  function openPropertyDefinitions() {
    if (disabled) return;
    setPropertyDefinitionsRequest(getPetTypePropertyDefinitionsAction({ id: petTypeId }));
  }

  function confirmDeletion() {
    if (disabled) return;

    showConfirmDialog({
      title: 'نوع حیوان حذف شود؟',
      message: `نوع حیوان «${petTypeTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2Icon,
      variant: 'error',
      onSuccess: async () => {
        await remove(petTypeId);
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
        <PetTypeDetailDialog
          petTypeId={petTypeId}
          request={detailRequest}
          onClose={() => setDetailRequest(null)}
          onUpdated={() => {
            setDetailRequest(null);
          }}
        />
      ) : null}
      {propertyDefinitionsRequest ? (
        <PetTypePropertyDefinitionsDialog
          petTypeId={petTypeId}
          request={propertyDefinitionsRequest}
          onClose={() => setPropertyDefinitionsRequest(null)}
          onUpdated={() => {
            setPropertyDefinitionsRequest(null);
          }}
        />
      ) : null}
    </>
  );
}
