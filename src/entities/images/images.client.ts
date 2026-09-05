'use client';

import {
  uploadFetcher,
  type UploadFetcherPromise,
  type UploadProgress,
} from '@/lib/api/uploadFetcher';

import type { ImageUploadDTO, UploadImageDTO } from './images.dto';

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
