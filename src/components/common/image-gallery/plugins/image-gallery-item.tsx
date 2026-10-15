import Image from 'next/image';

import { cn } from '@/lib/utils';

import type { ImageGalleryImage } from '../image-gallery.types';

type GalleryImageProps = Readonly<{
  image: ImageGalleryImage;
  loading?: 'eager' | 'lazy';
  sizes: string;
}>;

export function GalleryImage({ image, loading = 'lazy', sizes }: GalleryImageProps) {
  if (!image.src) return <div aria-hidden="true" className="tw:absolute tw:inset-0" />;

  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      loading={loading}
      sizes={sizes}
      placeholder={image.placeholderImage ? 'blur' : 'empty'}
      blurDataURL={image.placeholderImage}
      className={cn(
        'tw:transition-transform tw:duration-200 tw:ease-out tw:motion-reduce:transition-none',
        image.fit === 'contain' ? 'tw:object-contain' : 'tw:object-cover',
      )}
    />
  );
}
