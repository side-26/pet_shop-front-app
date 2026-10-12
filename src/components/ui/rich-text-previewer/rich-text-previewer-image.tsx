'use client';

import Image from 'next/image';
import { useEffect, useState, useSyncExternalStore } from 'react';

const mobileQuery = '(max-width: 767px)';
const tabletQuery = '(min-width: 768px) and (max-width: 1023px)';

export function richTextImageQuality() {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 85;
  if (window.matchMedia(mobileQuery).matches) return 65;
  if (window.matchMedia(tabletQuery).matches) return 70;
  return 85;
}

function subscribeToViewport(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined;
  }

  const mediaQueries = [window.matchMedia(mobileQuery), window.matchMedia(tabletQuery)];
  mediaQueries.forEach((mediaQuery) => mediaQuery.addEventListener('change', callback));

  return () =>
    mediaQueries.forEach((mediaQuery) => mediaQuery.removeEventListener('change', callback));
}

type RichTextPreviewerImageProps = Readonly<{
  alt: string;
  height?: number;
  src: string;
  width?: number;
}>;

type ImageDimensions = Readonly<{ height: number; src: string; width: number }>;

export function RichTextPreviewerImage({ alt, height, src, width }: RichTextPreviewerImageProps) {
  const quality = useSyncExternalStore(subscribeToViewport, richTextImageQuality, () => 85);
  const [naturalDimensions, setNaturalDimensions] = useState<ImageDimensions>();
  const resolvedDimensions =
    width && height
      ? { height, width }
      : naturalDimensions?.src === src
        ? naturalDimensions
        : undefined;

  useEffect(() => {
    if (width && height) return;

    let isActive = true;
    const image = new window.Image();
    image.onload = () => {
      if (!isActive || image.naturalWidth <= 0 || image.naturalHeight <= 0) return;
      setNaturalDimensions({ height: image.naturalHeight, src, width: image.naturalWidth });
    };
    image.src = src;

    return () => {
      isActive = false;
      image.onload = null;
    };
  }, [height, src, width]);

  if (!resolvedDimensions) return null;

  return (
    <Image
      src={src}
      alt={alt}
      width={resolvedDimensions.width}
      height={resolvedDimensions.height}
      loading="lazy"
      placeholder="empty"
      quality={quality}
      sizes="(min-width: 1024px) 896px, (min-width: 768px) 640px, 100vw"
      className="tw:h-auto tw:max-w-full tw:rounded-2xl"
    />
  );
}
