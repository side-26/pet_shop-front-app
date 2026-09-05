'use client';

import { ImageUpIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { useTipTapActionsContext } from '../context';

type TipTapImageUploadActionProps = {
  accept?: string;
  onUpload?: (file: File) => Promise<string | null> | string | null;
};

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(String(reader.result));
    reader.readAsDataURL(file);
  });
}

function TipTapImageUploadAction({ accept = 'image/*', onUpload }: TipTapImageUploadActionProps) {
  const { color, editable, editor } = useTipTapActionsContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  return (
    <>
      <input
        ref={inputRef}
        accept={accept}
        className="tw:sr-only"
        type="file"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;

          setIsUploading(true);
          try {
            const src = (await onUpload?.(file)) ?? (await readFileAsDataUrl(file));
            editor?.chain().focus().setImage({ alt: file.name, src }).run();
          } finally {
            setIsUploading(false);
          }
        }}
      />
      <Button
        color={color}
        disabled={!editable || !editor || isUploading}
        loadingText="در حال بارگذاری تصویر"
        size="sm"
        type="button"
        variant="outlined"
        isLoading={isUploading}
        onClick={() => inputRef.current?.click()}
      >
        <ImageUpIcon data-icon="inline-start" />
        افزودن تصویر
      </Button>
    </>
  );
}

export { TipTapImageUploadAction, type TipTapImageUploadActionProps };
