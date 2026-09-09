'use client';

import { ImageIcon, Trash2Icon } from 'lucide-react';

import { ImageFileField, useImageFileField } from '@/components/common/image-file-field';
import { ImageFilePreview } from '@/components/common/image-file-preview';
import { Button } from '@/components/ui/button';
import { MAIN_IMAGE_UPLOAD_ACCEPT_TYPES } from '@/configs/main-image-upload';
import type { BrandInput } from '@/entities/brands/brands.schema';

function SelectedLogoActions() {
  const { deleteImageFile, imageFile } = useImageFileField();

  if (!imageFile) return null;

  return (
    <Button
      type="button"
      variant="text"
      color="error"
      size="sm"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        deleteImageFile();
      }}
    >
      <Trash2Icon data-icon="inline-start" aria-hidden="true" />
      حذف لوگو
    </Button>
  );
}

export function BrandLogoField({ initialImageUrl }: { initialImageUrl?: string | null }) {
  return (
    <ImageFileField<BrandInput>
      name="logo"
      acceptTypes={MAIN_IMAGE_UPLOAD_ACCEPT_TYPES}
      hint="JPEG، JPG، PNG یا WebP تا حداکثر ۱ مگابایت"
      aria-label="انتخاب لوگوی برند"
    >
      <div className="tw:flex tw:min-h-32 tw:items-center tw:gap-4 tw:rounded-2xl tw:border tw:border-dashed tw:border-border-strong tw:bg-muted/35 tw:p-4 tw:hover:bg-muted/55">
        <ImageFilePreview
          alt="پیش‌نمایش لوگوی برند"
          initialImageUrl={initialImageUrl}
          className="tw:size-24 tw:rounded-xl"
          fallback={
            <div className="tw:flex tw:size-24 tw:items-center tw:justify-center tw:rounded-xl tw:bg-background tw:text-muted-foreground">
              <ImageIcon aria-hidden="true" />
            </div>
          }
        />
        <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-1">
          <span className="tw:text-label-l tw:text-foreground">لوگوی برند</span>
          <span className="tw:text-body-s tw:text-muted-foreground">
            برای انتخاب یا جایگزینی لوگو، این بخش را انتخاب کنید.
          </span>
          <SelectedLogoActions />
        </div>
      </div>
    </ImageFileField>
  );
}
