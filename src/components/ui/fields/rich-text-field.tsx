'use client';

import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useController, type FieldPath, type FieldValues } from 'react-hook-form';
import type { JSONContent } from '@tiptap/core';

import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { Progress } from '@/components/ui/progress';
import { RichText, RichTextFullHeaderActions } from '@/components/ui/rich-text';
import {
  readRichTextImageAsDataUrl,
  removeRichTextDraftImage,
  removePersistedRichTextImage,
  uploadRichTextDraftImage,
} from '@/entities/images/images.client';
import { isRichTextDocument, type RichTextDocument, type RichTextNode } from '@/lib/rich-text';

type RichTextFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label: string;
  hint?: string;
  required?: boolean;
};

function getLocalImageSources(content: RichTextDocument): Set<string> {
  const sources = new Set<string>();
  const visit = (node: RichTextNode) => {
    const source = node.type === 'image' ? node.attrs?.src : undefined;
    if (typeof source === 'string' && source.startsWith('data:image/')) sources.add(source);
    node.content?.forEach(visit);
  };
  visit(content);
  return sources;
}

function getBucketImageSources(content: RichTextDocument): Set<string> {
  const sources = new Set<string>();
  const visit = (node: RichTextNode) => {
    const source = node.type === 'image' ? node.attrs?.src : undefined;
    if (typeof source === 'string' && /^https?:\/\//.test(source)) sources.add(source);
    node.content?.forEach(visit);
  };
  visit(content);
  return sources;
}

export default function RichTextField<T extends FieldValues>({
  name,
  label,
  hint,
  required,
}: RichTextFieldProps<T>) {
  const id = useId();
  const { field, fieldState } = useController<T>({ name });
  const draftImageSources = useRef(new Set<string>());
  const persistedImageSources = useRef(new Set<string>());
  const deletingPersistedSources = useRef(new Set<string>());
  const [uploadCount, setUploadCount] = useState(0);
  const [deleteCount, setDeleteCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const content = useMemo<RichTextDocument>(
    () => (isRichTextDocument(field.value) ? field.value : { type: 'doc', content: [] }),
    [field.value],
  );
  useEffect(() => {
    for (const source of getBucketImageSources(content)) persistedImageSources.current.add(source);
  }, [content]);
  const onUpload = useCallback(async (file: File, { signal }: { signal: AbortSignal }) => {
    const source = await readRichTextImageAsDataUrl(file, { signal });
    draftImageSources.current.add(source);
    setUploadCount((count) => count + 1);
    const request = uploadRichTextDraftImage(source, file, ({ percent }) => {
      setUploadProgress(percent === null ? 0 : Math.round(percent));
    });
    void request.finally(() => setUploadCount((count) => Math.max(0, count - 1)));
    return source;
  }, []);
  const onChange = useCallback(
    (nextContent: JSONContent) => {
      const localSources = isRichTextDocument(nextContent)
        ? getLocalImageSources(nextContent)
        : new Set<string>();
      for (const source of draftImageSources.current) {
        if (localSources.has(source)) continue;
        draftImageSources.current.delete(source);
        setDeleteCount((count) => count + 1);
        void removeRichTextDraftImage(source).finally(() =>
          setDeleteCount((count) => Math.max(0, count - 1)),
        );
      }
      const bucketSources = isRichTextDocument(nextContent)
        ? getBucketImageSources(nextContent)
        : new Set<string>();
      for (const source of persistedImageSources.current) {
        if (bucketSources.has(source) || deletingPersistedSources.current.has(source)) continue;
        deletingPersistedSources.current.add(source);
        setDeleteCount((count) => count + 1);
        void removePersistedRichTextImage(source)
          .then((wasRemoved) => {
            if (wasRemoved) persistedImageSources.current.delete(source);
          })
          .finally(() => {
            deletingPersistedSources.current.delete(source);
            setDeleteCount((count) => Math.max(0, count - 1));
          });
      }
      field.onChange(nextContent);
    },
    [field],
  );

  useEffect(
    () => () => {
      for (const source of draftImageSources.current) void removeRichTextDraftImage(source);
    },
    [],
  );

  const isBusy = uploadCount + deleteCount > 0;

  return (
    <Field data-invalid={fieldState.invalid || undefined} className="tw:gap-2">
      <FieldLabel htmlFor={id}>
        {label}
        {required ? ' *' : ''}
      </FieldLabel>
      <div aria-busy={isBusy || undefined} className="tw:relative">
        <RichText
          id={id}
          aria-describedby={`${id}-description`}
          aria-invalid={fieldState.invalid}
          ariaLabel={label}
          content={content}
          color={fieldState.invalid ? 'error' : 'primary'}
          variant="outlined"
          headerActions={<RichTextFullHeaderActions onUpload={onUpload} />}
          onBlur={field.onBlur}
          onEditorElement={field.ref}
          onChange={onChange}
        />
        {isBusy ? (
          <div
            aria-live="polite"
            className="tw:absolute tw:inset-0 tw:flex tw:items-center tw:justify-center tw:rounded-xl tw:bg-background/80 tw:p-6 tw:backdrop-blur-sm"
          >
            <div className="tw:w-full tw:max-w-xs tw:rounded-lg tw:bg-background tw:p-4 tw:shadow-md">
              <p className="tw:mb-2 tw:text-label-m">
                {deleteCount > 0 ? 'در حال حذف تصویر' : 'در حال بارگذاری تصویر'}
              </p>
              <Progress
                aria-label={deleteCount > 0 ? 'در حال حذف تصویر' : 'پیشرفت بارگذاری تصویر'}
                color={fieldState.invalid ? 'error' : 'primary'}
                showLabel={deleteCount === 0}
                value={deleteCount > 0 ? 100 : uploadProgress}
              />
            </div>
          </div>
        ) : null}
      </div>
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
