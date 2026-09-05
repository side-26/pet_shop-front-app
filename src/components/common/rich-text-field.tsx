'use client';

import { useEffect, useId, useMemo, useRef } from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';

import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { TipTap, TipTapFullHeaderActions } from '@/components/ui/tip-tap';
import { deleteImageAction } from '@/entities/images/images.actions';
import { type RichTextDocument } from '@/lib/rich-text';

function imageUrls(content: unknown): Set<string> {
  const urls = new Set<string>();
  const visit = (node: unknown) => {
    if (!node || typeof node !== 'object') return;
    const record = node as Record<string, unknown>;
    if (
      record.type === 'image' &&
      typeof (record.attrs as Record<string, unknown> | undefined)?.src === 'string'
    ) {
      urls.add((record.attrs as Record<string, string>).src);
    }
    if (Array.isArray(record.content)) record.content.forEach(visit);
  };
  visit(content);
  return urls;
}

type RichTextFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  hint?: string;
  required?: boolean;
};

function RichTextField<T extends FieldValues>({
  name,
  label,
  hint,
  required,
}: RichTextFieldProps<T>) {
  const id = useId();
  const { field, fieldState } = useController<T>({ name });
  const initialUrls = useRef(imageUrls(field.value));
  const previousUrls = useRef(imageUrls(field.value));
  const content = useMemo<RichTextDocument>(
    () =>
      field.value && typeof field.value === 'object'
        ? (field.value as RichTextDocument)
        : { type: 'doc', content: [] },
    [field.value],
  );

  useEffect(
    () => () => {
      // The editor owns no pending requests after unmount; uploaded files remain valid drafts.
    },
    [],
  );

  return (
    <Field data-invalid={fieldState.invalid || undefined} className="tw:gap-2">
      <FieldLabel htmlFor={id}>
        {label}
        {required ? ' *' : ''}
      </FieldLabel>
      <TipTap
        ariaLabel={label}
        content={content}
        color={fieldState.invalid ? 'error' : 'primary'}
        variant="outlined"
        headerActions={<TipTapFullHeaderActions onUpload={() => null} />}
        onChange={(next) => {
          const nextUrls = imageUrls(next);
          for (const url of previousUrls.current) {
            if (initialUrls.current.has(url) && !nextUrls.has(url))
              void deleteImageAction({ imageUrl: url });
          }
          previousUrls.current = nextUrls;
          field.onChange(next);
        }}
      />
      <span
        id={`${id}-description`}
        role={fieldState.invalid ? 'alert' : undefined}
        className="tw:text-xs"
      >
        {fieldState.error?.message ?? hint}
      </span>
    </Field>
  );
}

export { RichTextField };
