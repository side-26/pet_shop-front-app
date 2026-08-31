'use client';

import { ImageIcon, Trash2Icon } from 'lucide-react';

import { ImageFileField, useImageFileField } from '@/components/common/image-file-field';
import { ImageFilePreview } from '@/components/common/image-file-preview';
import { Button } from '@/components/ui/button';
import type { PetTypeInput } from '@/entities/pet-types/pet-types.schema';
import {
  PET_TYPE_IMAGE_ACCEPT_TYPES,
  PET_TYPE_IMAGE_MAX_SIZE_BYTES,
} from '@/entities/pet-types/pet-types.schema';

function SelectedImageActions() {
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
      حذف تصویر
    </Button>
  );
}

export function PetTypeMainImageField({ initialImageUrl }: { initialImageUrl?: string | null }) {
  return (
    <ImageFileField<PetTypeInput>
      name="mainImage"
      acceptTypes={PET_TYPE_IMAGE_ACCEPT_TYPES}
      hint="JPEG، JPG، PNG یا WebP تا حداکثر ۱ مگابایت"
      aria-label="انتخاب تصویر اصلی نوع حیوان"
      required
    >
      <div className="tw:flex tw:min-h-32 tw:items-center tw:gap-4 tw:rounded-2xl tw:border tw:border-dashed tw:border-border-strong tw:bg-muted/35 tw:p-4 tw:hover:bg-muted/55">
        <ImageFilePreview
          alt="پیش‌نمایش تصویر اصلی نوع حیوان"
          initialImageUrl={initialImageUrl}
          className="tw:size-24 tw:rounded-xl"
          fallback={
            <div className="tw:flex tw:size-24 tw:items-center tw:justify-center tw:rounded-xl tw:bg-background tw:text-muted-foreground">
              <ImageIcon aria-hidden="true" />
            </div>
          }
        />
        <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-1">
          <span className="tw:text-label-l tw:text-foreground">تصویر اصلی</span>
          <span className="tw:text-body-s tw:text-muted-foreground">
            برای انتخاب یا جایگزینی تصویر، این بخش را انتخاب کنید.
          </span>
          <SelectedImageActions />
        </div>
      </div>
    </ImageFileField>
  );
}
