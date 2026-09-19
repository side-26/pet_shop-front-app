'use client';

import { useState } from 'react';
import { useRouter } from 'nextjs-toploader/app';
import { Images, Info, MoreHorizontal, Scale, Trash2 } from 'lucide-react';

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
  getProductWeightsAction,
} from '@/entities/products/products.actions';
import { submitDeleteProduct } from '@/entities/products/products.client';
import { useCommonStore } from '@/stores/common.store';

import type {
  ProductFormOptionsRequest,
  ProductSection,
  ProductSectionRequest,
} from './product-section-dialog.types';
import { ProductSectionDialog } from './product-section-dialog';
import { ProductWeightsDialog } from './product-weights-dialog';
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
  const [weightsRequest, setWeightsRequest] = useState<ReturnType<
    typeof getProductWeightsAction
  > | null>(null);
  function open(section: ProductSection) {
    if (disabled) return;
    const request =
      section === 'main-info'
        ? getProductMainInfoAction({ id: productId })
        : getProductImagesAction({ id: productId });
    setDialog({
      section,
      request: request as ProductSectionRequest,
      optionsRequest: getProductFormOptionsAction(),
    });
  }
  function openWeights() {
    if (disabled) return;
    setWeightsRequest(getProductWeightsAction({ id: productId }));
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
            <DropdownMenuItem onClick={openWeights}>
              <Scale aria-hidden="true" />
              ویرایش وزن‌ها و قیمت‌ها
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
        <ProductSectionDialog
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
      ) : null}
      {weightsRequest ? (
        <ProductWeightsDialog
          productId={productId}
          productTitle={productTitle}
          request={weightsRequest}
          onClose={() => setWeightsRequest(null)}
          onUpdated={() => {
            setWeightsRequest(null);
            router.refresh();
          }}
        />
      ) : null}
    </>
  );
}
