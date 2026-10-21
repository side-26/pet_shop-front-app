'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState } from 'react';
import { EyeIcon, MoreHorizontalIcon, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteBrand } from '@/entities/brands/brands.client';
import { useCommonStore } from '@/stores/common.store';
import type { BrandTableRow } from './brands-table.types';
import type { BrandDetailRequest, BrandFormDialogHandle } from './brand-form-dialog.types';

const LazyBrandDetailDialog = dynamic(() =>
  import('./brand-detail-dialog').then((module) => module.BrandDetailDialog),
);
export function BrandRowActions({
  brand,
  disabled = false,
}: {
  brand: BrandTableRow;
  disabled?: boolean;
}) {
  const confirm = useCommonStore((state) => state.showConfirmDialog);
  const detailDialogRef = useRef<BrandFormDialogHandle>(null);
  const [detailRequest, setDetailRequest] = useState<BrandDetailRequest | null>(null);
  const { remove } = useDeleteBrand(() => undefined);

  function openDetail() {
    if (disabled) return;
    if (detailDialogRef.current) detailDialogRef.current.open();
    else {
      setDetailRequest(
        Promise.resolve({
          isSuccess: true,
          message: null,
          data: {
            id: brand.id,
            title: brand.title,
            title_fa: brand.titleFa,
            description: brand.description,
            isEnable: brand.isEnable,
            logo: brand.logo,
          },
        }),
      );
    }
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
              aria-label={`عملیات ${brand.title}`}
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
            <DropdownMenuItem
              variant="destructive"
              onClick={() =>
                confirm({
                  title: 'برند حذف شود؟',
                  message: `برند «${brand.title}» به‌صورت دائمی حذف خواهد شد.`,
                  icon: Trash2Icon,
                  variant: 'error',
                  onSuccess: async () => {
                    await remove(brand.id);
                  },
                })
              }
            >
              <Trash2Icon aria-hidden="true" />
              حذف برند
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {detailRequest ? (
        <Suspense fallback={null}>
          <LazyBrandDetailDialog
            ref={detailDialogRef}
            brandId={brand.id}
            request={detailRequest}
            openOnMount
            onClosed={() => setDetailRequest(null)}
            onUpdated={() => {
              setDetailRequest(null);
            }}
          />
        </Suspense>
      ) : null}
    </>
  );
}
