'use client';

import { ImagePlus, Star, Trash2 } from 'lucide-react';
import { useId, useRef, type ChangeEvent, type ReactNode } from 'react';
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';

import { useImageObjectUrl } from '@/components/common/image-file-preview';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from '@/components/ui/carousel';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { cn } from '@/lib/utils';

const DEFAULT_MAX_IMAGES = 5;
const DEFAULT_MULTIPLE_IMAGE_ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

type MultipleImageUploaderValue = {
  images: File[];
  mainImageIndex: number | null;
};

type MultipleImageUploaderFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  acceptTypes?: readonly string[];
  className?: string;
  control?: Control<TFieldValues>;
  defaultImages?: readonly string[];
  disabled?: boolean;
  hint?: ReactNode;
  id?: string;
  label?: ReactNode;
  mainImageUrl?: string;
  maxImages?: number;
  name: TName;
  rules?: Omit<
    RegisterOptions<TFieldValues, TName>,
    'disabled' | 'setValueAs' | 'valueAsDate' | 'valueAsNumber'
  >;
  shouldUnregister?: boolean;
};

function normalizeValue(value: unknown): MultipleImageUploaderValue {
  if (!value || typeof value !== 'object') return { images: [], mainImageIndex: null };

  const candidate = value as Partial<MultipleImageUploaderValue>;
  const images = Array.isArray(candidate.images)
    ? candidate.images.filter((image): image is File =>
        typeof File !== 'undefined' ? image instanceof File : false,
      )
    : [];
  const mainImageIndex =
    typeof candidate.mainImageIndex === 'number' &&
    candidate.mainImageIndex >= 0 &&
    candidate.mainImageIndex < images.length
      ? candidate.mainImageIndex
      : images.length > 0
        ? 0
        : null;

  return { images, mainImageIndex };
}

function getFileIdentity(file: File) {
  return `${file.name}:${file.size}:${file.type}:${file.lastModified}`;
}

function SelectedImage({ file }: { file: File }) {
  const imageUrl = useImageObjectUrl(file);

  return imageUrl ? (
    // Object URLs are local browser resources and cannot be optimized by next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt="" className="tw:size-full tw:object-cover" />
  ) : (
    <div className="tw:flex tw:size-full tw:items-center tw:justify-center tw:bg-muted">
      <ImagePlus aria-hidden="true" className="tw:size-8 tw:text-muted-foreground" />
    </div>
  );
}

function PersistedImage({ alt, url }: { alt: string; url: string }) {
  return (
    // Persisted remote images are supplied by the API and may use arbitrary hostnames.
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt} className="tw:size-full tw:object-cover" />
  );
}

function ImageCarouselNavigation() {
  const { canScrollNext, canScrollPrev } = useCarousel();

  return (
    <>
      {canScrollPrev ? <CarouselPrevious className="tw:start-0" /> : null}
      {canScrollNext ? <CarouselNext className="tw:end-0" /> : null}
    </>
  );
}

function ImageCarousel({ ariaLabel, children }: { ariaLabel: string; children: ReactNode }) {
  return (
    <Carousel
      aria-label={ariaLabel}
      opts={{ align: 'start', containScroll: 'trimSnaps' }}
      className="tw:w-full tw:overflow-x-hidden tw:px-11"
    >
      <CarouselContent>{children}</CarouselContent>
      <ImageCarouselNavigation />
    </Carousel>
  );
}

function MultipleImageUploaderField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  acceptTypes = DEFAULT_MULTIPLE_IMAGE_ACCEPT_TYPES,
  className,
  control,
  defaultImages = [],
  disabled,
  hint,
  id: providedId,
  label = 'تصاویر',
  mainImageUrl,
  maxImages = DEFAULT_MAX_IMAGES,
  name,
  rules,
  shouldUnregister,
}: MultipleImageUploaderFieldProps<TFieldValues, TName>) {
  const generatedId = useId();
  const id = providedId ?? generatedId;
  const descriptionId = `${id}-description`;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { field, fieldState } = useController({ control, disabled, name, rules, shouldUnregister });
  const value = normalizeValue(field.value);
  const persistedImages = Array.from(
    new Set(
      defaultImages.filter(
        (imageUrl): imageUrl is string => Boolean(imageUrl.trim()) && imageUrl !== mainImageUrl,
      ),
    ),
  );
  const imageLimit = Math.min(DEFAULT_MAX_IMAGES, Math.max(1, Math.floor(maxImages)));
  const isFull = value.images.length >= imageLimit;
  const accept = acceptTypes
    .map((type) => type.trim())
    .filter(Boolean)
    .join(',');
  const message = fieldState.error?.message ?? hint;

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);
    const knownFiles = new Set(value.images.map(getFileIdentity));
    const acceptedFiles = selectedFiles.filter(
      (file) => acceptTypes.includes(file.type) && !knownFiles.has(getFileIdentity(file)),
    );
    const images = [...value.images, ...acceptedFiles].slice(0, imageLimit);

    if (images.length !== value.images.length) {
      field.onChange({
        images,
        mainImageIndex: value.mainImageIndex ?? 0,
      } satisfies MultipleImageUploaderValue);
    }

    event.target.value = '';
  }

  function removeImage(index: number) {
    const images = value.images.filter((_, imageIndex) => imageIndex !== index);
    let mainImageIndex = value.mainImageIndex;

    if (images.length === 0) mainImageIndex = null;
    else if (mainImageIndex === index) mainImageIndex = 0;
    else if (mainImageIndex !== null && mainImageIndex > index) mainImageIndex -= 1;

    field.onChange({ images, mainImageIndex } satisfies MultipleImageUploaderValue);
  }

  return (
    <Field
      data-invalid={fieldState.invalid || undefined}
      data-disabled={disabled || undefined}
      className={cn('tw:min-w-0 tw:w-full tw:overflow-x-hidden', className)}
    >
      <div className="tw:flex tw:flex-wrap tw:items-center tw:justify-between tw:gap-3">
        <div className="tw:flex tw:flex-col tw:gap-1">
          <FieldLabel htmlFor={id}>{label}</FieldLabel>
          <span className="tw:text-label-s tw:text-muted-foreground">
            {value.images.length} از {imageLimit} تصویر
          </span>
        </div>

        <input
          id={id}
          ref={(element) => {
            inputRef.current = element;
            field.ref(element);
          }}
          name={field.name}
          type="file"
          accept={accept}
          multiple
          disabled={disabled || isFull}
          aria-invalid={fieldState.invalid}
          aria-describedby={descriptionId}
          className="tw:sr-only"
          onBlur={field.onBlur}
          onChange={handleChange}
        />
        <Button
          type="button"
          variant="outlined"
          size="sm"
          disabled={disabled || isFull}
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus aria-hidden="true" />
          انتخاب تصویر
        </Button>
      </div>

      {mainImageUrl || persistedImages.length > 0 ? (
        <section aria-label="تصاویر فعلی" className="tw:flex tw:flex-col tw:gap-3">
          <span className="tw:text-label-m tw:text-muted-foreground">تصاویر فعلی</span>
          <ImageCarousel ariaLabel="تصاویر فعلی به‌صورت اسلایدی">
            {mainImageUrl ? (
              <CarouselItem className="tw:basis-[100px]">
                <div className="tw:overflow-hidden tw:rounded-2xl tw:border tw:border-primary tw:bg-card tw:shadow-sm tw:ring-2 tw:ring-primary/20">
                  <div className="tw:relative tw:aspect-square tw:overflow-hidden">
                    <PersistedImage alt="تصویر اصلی فعلی" url={mainImageUrl} />
                    <Star
                      aria-hidden="true"
                      className="tw:absolute tw:start-2 tw:top-2 tw:size-5 tw:fill-primary tw:text-primary"
                    />
                  </div>
                </div>
              </CarouselItem>
            ) : null}
            {persistedImages.map((imageUrl, index) => (
              <CarouselItem key={imageUrl} className="tw:basis-[100px]">
                <div className="tw:overflow-hidden tw:rounded-2xl tw:border tw:border-border tw:bg-card tw:shadow-sm">
                  <div className="tw:aspect-square tw:overflow-hidden">
                    <PersistedImage alt={`تصویر فعلی ${index + 1}`} url={imageUrl} />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </ImageCarousel>
        </section>
      ) : null}

      {value.images.length > 0 ? (
        <ImageCarousel ariaLabel="تصاویر انتخاب‌شده به‌صورت اسلایدی">
          {value.images.map((file, index) => {
            const isMainImage = value.mainImageIndex === index;

            return (
              <CarouselItem key={getFileIdentity(file)} className={cn('tw:basis-[160px]')}>
                <div
                  className={cn(
                    'tw:overflow-hidden tw:rounded-2xl tw:border tw:bg-card tw:shadow-sm',
                    isMainImage
                      ? 'tw:border-primary tw:ring-2 tw:ring-primary/20'
                      : 'tw:border-border',
                  )}
                >
                  <div className="tw:relative tw:aspect-square tw:overflow-hidden">
                    <SelectedImage file={file} />
                    {isMainImage ? (
                      <Star
                        aria-hidden="true"
                        className="tw:absolute tw:start-2 tw:top-2 tw:size-5 tw:fill-primary tw:text-primary"
                      />
                    ) : null}
                  </div>
                  <div className="tw:flex tw:flex-col tw:gap-2 tw:p-2">
                    <span className="tw:truncate tw:text-label-s" title={file.name}>
                      {file.name}
                    </span>
                    <div className="tw:flex tw:items-center tw:justify-between tw:gap-1">
                      <Button
                        type="button"
                        size="xs"
                        variant={isMainImage ? 'tonal' : 'flat'}
                        disabled={disabled || isMainImage}
                        aria-pressed={isMainImage}
                        aria-label={`انتخاب ${file.name} به‌عنوان تصویر اصلی`}
                        onClick={() =>
                          field.onChange({
                            ...value,
                            mainImageIndex: index,
                          } satisfies MultipleImageUploaderValue)
                        }
                      >
                        <Star aria-hidden="true" />
                        اصلی
                      </Button>
                      <Button
                        type="button"
                        iconOnly
                        size="xs"
                        variant="flat"
                        color="error"
                        disabled={disabled}
                        aria-label={`حذف ${file.name}`}
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 aria-hidden="true" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </ImageCarousel>
      ) : (
        <Button
          type="button"
          block
          variant="outlined"
          disabled={disabled}
          className="tw:min-h-36 tw:flex-col tw:border-dashed tw:bg-muted/30 tw:p-5 tw:text-center tw:whitespace-normal"
          onClick={() => inputRef.current?.click()}
        >
          <ImagePlus aria-hidden="true" className="tw:size-8 tw:text-muted-foreground" />
          <span className="tw:text-body-m tw:font-medium">یک یا چند تصویر انتخاب کنید</span>
          <span className="tw:text-label-s tw:text-muted-foreground">
            انتخاب مرحله‌ای نیز امکان‌پذیر است.
          </span>
        </Button>
      )}

      <span
        id={descriptionId}
        role={fieldState.invalid ? 'alert' : undefined}
        className={cn(
          'tw:min-h-[1lh] tw:text-xs tw:text-muted-foreground',
          fieldState.invalid && 'tw:text-error',
        )}
      >
        {message}
      </span>
    </Field>
  );
}

export {
  DEFAULT_MAX_IMAGES,
  DEFAULT_MULTIPLE_IMAGE_ACCEPT_TYPES,
  MultipleImageUploaderField,
  type MultipleImageUploaderFieldProps,
  type MultipleImageUploaderValue,
};
