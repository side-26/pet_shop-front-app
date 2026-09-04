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
  getProductFormOptionsAction,
  getProductImagesAction,
  getProductMainInfoAction,
  getProductPriceAction,
} from '@/entities/products/products.actions';
import { submitDeleteProduct } from '@/entities/products/products.client';
import { useCommonStore } from '@/stores/common.store';

import type {
  ProductFormOptionsRequest,
  ProductSection,
  ProductSectionRequest,
} from './product-section-dialog.types';

const LazyProductSectionDialog = lazy(async () => ({
  default: (await import('./product-section-dialog')).ProductSectionDialog,
}));
type DialogState = {
  section: ProductSection;
  request: ProductSectionRequest;
  optionsRequest: ProductFormOptionsRequest;
} | null;
type Props = { productId: string; productTitle: string; disabled?: boolean };

export function ProductRowActions({ productId, productTitle, disabled = false }: Props) {
  const router = useRouter();
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);
  const [dialog, setDialog] = useState<DialogState>(null);
  function open(section: ProductSection) {
    if (disabled) return;
    const request =
      section === 'main-info'
        ? getProductMainInfoAction({ id: productId })
        : section === 'price'
          ? getProductPriceAction({ id: productId })
          : getProductImagesAction({ id: productId });
    setDialog({
      section,
      request: request as ProductSectionRequest,
      optionsRequest: getProductFormOptionsAction(),
    });
  }
  function remove() {
    if (disabled) return;
    showConfirmDialog({
      title: 'محصول حذف شود؟',
      message: `«${productTitle}» به‌صورت دائمی حذف خواهد شد. این عمل قابل بازگشت نیست.`,
      icon: Trash2,
      variant: 'error',
      onSuccess: async () => {
        if (await submitDeleteProduct(productId)) router.refresh();
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
              aria-label={`عملیات ${productTitle}`}
            />
          }
        >
          <MoreHorizontal aria-hidden="true" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => open('main-info')}>
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
              حذف محصول
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {dialog ? (
        <Suspense fallback={null}>
          <LazyProductSectionDialog
            productId={productId}
            productTitle={productTitle}
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
