'use client';

import { useId, useMemo } from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';

import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { RichText, RichTextFullHeaderActions } from '@/components/ui/rich-text';
import { uploadImage } from '@/entities/images/images.client';
import { type RichTextDocument } from '@/lib/rich-text';

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
  const content = useMemo<RichTextDocument>(
    () =>
      field.value && typeof field.value === 'object'
        ? (field.value as RichTextDocument)
        : { type: 'doc', content: [] },
    [field.value],
  );

  return (
    <Field data-invalid={fieldState.invalid || undefined} className="tw:gap-2">
      <FieldLabel htmlFor={id}>
        {label}
        {required ? ' *' : ''}
      </FieldLabel>
      <RichText
        id={id}
        aria-describedby={`${id}-description`}
        aria-invalid={fieldState.invalid}
        ariaLabel={label}
        content={content}
        color={fieldState.invalid ? 'error' : 'primary'}
        variant="outlined"
        headerActions={
          <RichTextFullHeaderActions
            onUpload={async (file) => {
              const result = await uploadImage({ mainImage: file });
              if (!result.isSuccess) throw result;
              return result.data.imageUrl;
            }}
          />
        }
        onBlur={field.onBlur}
        onEditorElement={field.ref}
        onChange={field.onChange}
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
