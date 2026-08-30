'use client';

import { createContext, useCallback, useContext, useMemo, type ReactNode } from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';

import { FileField, type FileFieldProps } from '@/components/ui/fields/file-field';

const DEFAULT_IMAGE_ACCEPT_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

type ImageFileFieldContextValue = {
  changeImageFile: (imageFile: File | null) => void;
  deleteImageFile: () => void;
  imageFile: File | null;
};

const ImageFileFieldContext = createContext<ImageFileFieldContextValue | null>(null);

function useImageFileField() {
  const context = useContext(ImageFileFieldContext);

  if (!context) {
    throw new Error('ImageFileField components must be used inside ImageFileField.');
  }

  return context;
}

type ImageFileFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = Omit<FileFieldProps<TFieldValues, TName>, 'acceptTypes' | 'children'> & {
  acceptTypes?: readonly string[];
  children: ReactNode;
};

function ImageFileField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  acceptTypes = DEFAULT_IMAGE_ACCEPT_TYPES,
  children,
  control,
  disabled,
  name,
  shouldUnregister,
  ...fileFieldProps
}: ImageFileFieldProps<TFieldValues, TName>) {
  const { field } = useController({ control, disabled, name, shouldUnregister });
  const value = field.value as unknown;
  const imageFile = typeof File !== 'undefined' && value instanceof File ? value : null;

  const changeImageFile = useCallback(
    (nextImageFile: File | null) => {
      field.onChange(nextImageFile);
    },
    [field],
  );
  const deleteImageFile = useCallback(() => changeImageFile(null), [changeImageFile]);
  const contextValue = useMemo<ImageFileFieldContextValue>(
    () => ({ imageFile, changeImageFile, deleteImageFile }),
    [changeImageFile, deleteImageFile, imageFile],
  );

  return (
    <ImageFileFieldContext.Provider value={contextValue}>
      <FileField
        {...fileFieldProps}
        name={name}
        control={control}
        disabled={disabled}
        shouldUnregister={shouldUnregister}
        acceptTypes={acceptTypes}
      >
        {() => children}
      </FileField>
    </ImageFileFieldContext.Provider>
  );
}

export { DEFAULT_IMAGE_ACCEPT_TYPES, ImageFileField, useImageFileField, type ImageFileFieldProps };
