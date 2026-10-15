import type { ReactNode } from 'react';

export type ImageGalleryImage = Readonly<{
  alt: string;
  fit?: 'contain' | 'cover';
  placeholderImage?: string;
  src: string;
}>;

export type ImageGalleryProps = Readonly<{
  ariaLabel?: string;
  className?: string;
  images: readonly ImageGalleryImage[];
  previewImagePreview?: ReactNode;
}>;
