export const MAIN_IMAGE_UPLOAD_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;
export const MAIN_IMAGE_UPLOAD_ACCEPT_TYPES = [
  ...MAIN_IMAGE_UPLOAD_MIME_TYPES,
  '.jpeg',
  '.jpg',
  '.png',
  '.webp',
] as const;
export const MAIN_IMAGE_UPLOAD_MAX_SIZE_BYTES = 1024 * 1024;
