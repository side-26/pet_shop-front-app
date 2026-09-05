'use client';

import { useCallback } from 'react';
import {
  uploadFetcher,
  type UploadFetcherPromise,
  type UploadProgress,
} from '@/lib/api/uploadFetcher';

import type { ImageUploadDTO, UploadImageDTO } from './images.dto';
import type { RichTextDocument, RichTextNode } from '@/lib/rich-text';

/** Uploads through the authenticated same-origin `/api/images` proxy. */
export function uploadImage(
  input: UploadImageDTO,
  onProgress?: (progress: UploadProgress) => void,
): UploadFetcherPromise<ImageUploadDTO> {
  const body = new FormData();
  body.set('mainImage', input.mainImage);

  return uploadFetcher<ImageUploadDTO>({
    url: '/api/images',
    body,
    onProgress,
    withCredentials: true,
  });
}

export function useUploadImage() {
  return useCallback(
    (input: UploadImageDTO, onProgress?: (progress: UploadProgress) => void) =>
      uploadImage(input, onProgress),
    [],
  );
}

function isLocalImageSource(src: unknown): src is string {
  return typeof src === 'string' && src.startsWith('data:image/');
}

async function uploadEmbeddedImage(source: string): Promise<string> {
  const blob = await (await fetch(source)).blob();
  const result = await uploadImage({
    mainImage: new File([blob], 'rich-text-image', { type: blob.type || 'image/webp' }),
  });
  if (!result.isSuccess) throw result;
  return result.data.imageUrl;
}

/** Replaces editor-local data URLs only when a form is submitted. */
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
