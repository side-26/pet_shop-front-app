'use client';

import { ImageUpIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { useTipTapActionsContext } from '../context';

export type ImageUploadContext = { signal: AbortSignal; onProgress: (progress: number) => void };

type TipTapImageUploadActionProps = {
  accept?: string;
  onUpload?: (file: File, context: ImageUploadContext) => Promise<string> | string;
};

function TipTapImageUploadAction({ accept = 'image/*', onUpload }: TipTapImageUploadActionProps) {
  const { color, editable, editor } = useTipTapActionsContext();
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
    },
    [],
  );

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
          setUploadProgress(0);
          setIsUploading(true);
          const position = editor?.state.selection.anchor;
          const controller = new AbortController();
          abortControllerRef.current = controller;
          try {
            const src = await onUpload(file, {
              signal: controller.signal,
              onProgress: setUploadProgress,
            });
            if (controller.signal.aborted || !editor || position === undefined) return;
            editor
              .chain()
              .focus()
              .setTextSelection(position)
              .setImage({ alt: file.name, src })
              .run();
          } catch {
            if (!controller.signal.aborted)
              setError('بارگذاری تصویر ناموفق بود. دوباره تلاش کنید.');
          } finally {
            if (abortControllerRef.current === controller) {
              abortControllerRef.current = null;
              setIsUploading(false);
              setUploadProgress(0);
            }
          }
        }}
      />
      {onUpload ? (
        <>
          <Button
            color={color}
            disabled={!editable || !editor || isUploading}
            loadingText={`در حال بارگذاری تصویر ${uploadProgress}%`}
            size="sm"
            type="button"
            variant="outlined"
            isLoading={isUploading}
            onClick={() => inputRef.current?.click()}
          >
            <ImageUpIcon data-icon="inline-start" />
            افزودن تصویر
          </Button>
          {isUploading ? <Progress color={color} size="xs" value={uploadProgress} /> : null}
        </>
      ) : null}
      {error ? (
        <p role="alert" className="tw:text-xs tw:text-error">
          {error}
        </p>
      ) : null}
    </>
  );
}

export { TipTapImageUploadAction, type TipTapImageUploadActionProps };
