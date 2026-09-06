'use client';

import { useCallback } from 'react';
import {
  uploadFetcher,
  type UploadFetcherPromise,
  type UploadProgress,
} from '@/lib/api/uploadFetcher';

import type { ImageUploadDTO, UploadImageDTO } from './images.dto';
import { IMAGE_UPLOAD_MAX_SIZE_BYTES, IMAGE_UPLOAD_MIME_TYPES } from './images.schema';
import type { RichTextDocument, RichTextNode } from '@/lib/rich-text';
import { deleteImageAction } from './images.actions';
import { toast } from '@/components/ui/toast';

type UploadImageOptions = {
  signal?: AbortSignal;
  onProgress?: (progress: UploadProgress) => void;
};

type RichTextDraftImage = {
  bucketUrl?: string;
  isRemoved: boolean;
  status: 'uploading' | 'uploaded' | 'deleting' | 'failed';
  request: UploadFetcherPromise<ImageUploadDTO>;
};

const richTextDraftImages = new Map<string, RichTextDraftImage>();
/** Exposed draft cache: local base64 source → durable bucket URL. */
export const richTextDraftImageUrls = new Map<string, string>();

export function hasPendingRichTextImageOperations() {
  return [...richTextDraftImages.values()].some(
    ({ status }) => status === 'uploading' || status === 'deleting',
  );
}

/** Uploads through the authenticated same-origin `/api/images` proxy. */
export function uploadImage(
  input: UploadImageDTO,
  options: UploadImageOptions | UploadImageOptions['onProgress'] = {},
): UploadFetcherPromise<ImageUploadDTO> {
  const normalizedOptions = typeof options === 'function' ? { onProgress: options } : options;
  const body = new FormData();
  body.set('mainImage', input.mainImage);

  return uploadFetcher<ImageUploadDTO>({
    url: '/api/images',
    body,
    onProgress: normalizedOptions.onProgress,
    signal: normalizedOptions.signal,
    withCredentials: true,
  });
}

export function useUploadImage() {
  return useCallback(
    (input: UploadImageDTO, options?: UploadImageOptions | UploadImageOptions['onProgress']) =>
      uploadImage(input, options),
    [],
  );
}

export function readRichTextImageAsDataUrl(
  file: File,
  { signal }: { signal: AbortSignal },
): Promise<string> {
  if (!IMAGE_UPLOAD_MIME_TYPES.includes(file.type as (typeof IMAGE_UPLOAD_MIME_TYPES)[number])) {
    return Promise.reject(new Error('unsupported-image-type'));
  }
  if (file.size > IMAGE_UPLOAD_MAX_SIZE_BYTES) return Promise.reject(new Error('image-too-large'));

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    const cleanup = () => {
      signal.removeEventListener('abort', abort);
      reader.onload = null;
      reader.onerror = null;
      reader.onabort = null;
    };
    const abort = () => reader.abort();
    const fail = (error: Error) => {
      cleanup();
      reject(error);
    };

    if (signal.aborted) {
      fail(new DOMException('The image read was cancelled.', 'AbortError'));
      return;
    }

    signal.addEventListener('abort', abort, { once: true });
    reader.onerror = () => fail(reader.error ?? new Error('image-read-failed'));
    reader.onabort = () => fail(new DOMException('The image read was cancelled.', 'AbortError'));
    reader.onload = () => {
      const result = reader.result;
      cleanup();
      if (typeof result === 'string') resolve(result);
      else reject(new Error('image-read-failed'));
    };
    reader.readAsDataURL(file);
  });
}

/** Starts a bucket upload without replacing the local data URL displayed by the editor. */
export function uploadRichTextDraftImage(
  source: string,
  file: File,
  onProgress: (progress: UploadProgress) => void,
) {
  const request = uploadImage({ mainImage: file }, onProgress);
  const draft: RichTextDraftImage = { isRemoved: false, request, status: 'uploading' };
  richTextDraftImages.set(source, draft);

  void request.then(async (result) => {
    if (!result.isSuccess) {
      draft.status = 'failed';
      if (!draft.isRemoved) toast.add({ type: 'error', title: result.message });
      return;
    }
    draft.bucketUrl = result.data.imageUrl;
    draft.status = 'uploaded';
    richTextDraftImageUrls.set(source, result.data.imageUrl);
    if (draft.isRemoved) await removeRichTextDraftImage(source);
  });

  return request;
}

/** Cancels a local draft upload or removes its completed, unpersisted bucket object. */
export async function removeRichTextDraftImage(source: string) {
  const draft = richTextDraftImages.get(source);
  if (!draft) return;

  draft.isRemoved = true;
  draft.status = 'deleting';
  draft.request.abort();
  const result = await draft.request;
  const bucketUrl = draft.bucketUrl ?? (result.isSuccess ? result.data.imageUrl : undefined);
  if (!bucketUrl) {
    richTextDraftImages.delete(source);
    return;
  }
  const deletion = await deleteImageAction({ imageUrl: bucketUrl });
  if (deletion.isSuccess) {
    richTextDraftImages.delete(source);
    richTextDraftImageUrls.delete(source);
  } else {
    draft.status = 'uploaded';
    toast.add({ type: 'error', title: deletion.message });
  }
}

/** Removes a bucket image that was already present when an edit form opened. */
export async function removePersistedRichTextImage(imageUrl: string): Promise<boolean> {
  const deletion = await deleteImageAction({ imageUrl });
  if (deletion.isSuccess) return true;
  toast.add({ type: 'error', title: deletion.message });
  return false;
}

function isLocalImageSource(src: unknown): src is string {
  return typeof src === 'string' && src.startsWith('data:image/');
}

async function uploadEmbeddedImage(source: string): Promise<string> {
  const bucketUrl = richTextDraftImageUrls.get(source);
  if (bucketUrl) return bucketUrl;
  const draft = richTextDraftImages.get(source);
  if (draft) {
    const result = await draft.request;
    if (result.isSuccess) return result.data.imageUrl;
  }
  const blob = await (await fetch(source)).blob();
  const result = await uploadImage({
    mainImage: new File([blob], 'rich-text-image', { type: blob.type || 'image/webp' }),
  });
  if (!result.isSuccess) throw result;
  richTextDraftImageUrls.set(source, result.data.imageUrl);
  return result.data.imageUrl;
}

/** Keeps completed draft objects after a successful parent mutation; they are now persisted. */
export function persistRichTextDraftImages(content: RichTextDocument) {
  const bucketUrls = new Set(getRichTextBucketUrls(content));
  for (const [source, draft] of richTextDraftImages) {
    if (draft.bucketUrl && bucketUrls.has(draft.bucketUrl)) richTextDraftImages.delete(source);
    if (draft.bucketUrl && bucketUrls.has(draft.bucketUrl)) richTextDraftImageUrls.delete(source);
  }
}

function getRichTextBucketUrls(content: RichTextDocument): string[] {
  const urls: string[] = [];
  const visit = (node: RichTextNode) => {
    const source = node.type === 'image' ? node.attrs?.src : undefined;
    if (typeof source === 'string' && /^https?:\/\//.test(source)) urls.push(source);
    node.content?.forEach(visit);
  };
  visit(content);
  return urls;
}

/** Uploads only data URLs that remain in the submitted document. Bucket URLs are left unchanged. */
export async function uploadRichTextImages(content: RichTextDocument): Promise<RichTextDocument> {
  const next = structuredClone(content) as RichTextDocument;
  const visit = async (node: RichTextNode): Promise<void> => {
    if (node.type === 'image' && isLocalImageSource(node.attrs?.src)) {
      node.attrs = { ...node.attrs, src: await uploadEmbeddedImage(node.attrs.src) };
    }
    await Promise.all(node.content?.map(visit) ?? []);
  };
  await visit(next);
  return next;
}
