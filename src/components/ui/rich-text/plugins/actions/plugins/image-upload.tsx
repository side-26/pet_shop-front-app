'use client';

import { ImageUpIcon } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { useTipTapActionsContext } from '../context';

type TipTapImageUploadActionProps = {
  accept?: string;
  onUpload?: (file: File) => Promise<string> | string;
};

function TipTapImageUploadAction({ accept = 'image/*', onUpload }: TipTapImageUploadActionProps) {
  const { color, editable, editor } = useTipTapActionsContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

          if (!onUpload) {
            setError('بارگذاری تصویر برای این ویرایشگر پیکربندی نشده است.');
            return;
          }

          setError(null);
          setIsUploading(true);
          try {
            const src = await onUpload(file);
            editor?.chain().focus().setImage({ alt: file.name, src }).run();
          } catch {
            setError('بارگذاری تصویر ناموفق بود. دوباره تلاش کنید.');
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
      {error ? (
        <p role="alert" className="tw:text-xs tw:text-error">
          {error}
        </p>
      ) : null}
    </>
  );
}

export { TipTapImageUploadAction, type TipTapImageUploadActionProps };
