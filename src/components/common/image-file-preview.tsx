'use client';

import { useEffect, useState, type ComponentProps, type ReactNode } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

import { useImageFileField } from './image-file-field';

type ImageFilePreviewProps = Omit<ComponentProps<'img'>, 'alt' | 'src'> & {
  alt: string;
  avatar?: boolean;
  avatarFallback?: ReactNode;
  fallback?: ReactNode;
  initialImageUrl?: string | null;
};

function useImageObjectUrl(imageFile: File | null) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!imageFile || typeof URL === 'undefined') return;

    const nextImageUrl = URL.createObjectURL(imageFile);
    // Object URLs are allocated after rendering, so this update is intentional.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setImageUrl(nextImageUrl);

    return () => URL.revokeObjectURL(nextImageUrl);
  }, [imageFile]);

  return imageFile ? imageUrl : null;
}

function ImageFilePreview({
  alt,
  avatar = false,
  avatarFallback = '—',
  className,
  fallback = null,
  initialImageUrl = null,
  ...imageProps
}: ImageFilePreviewProps) {
  const { imageFile } = useImageFileField();
  const objectUrl = useImageObjectUrl(imageFile);
  const imageUrl = objectUrl ?? initialImageUrl;

  if (!imageUrl) return fallback;

  if (avatar) {
    return (
      <Avatar className={className}>
        <AvatarImage src={imageUrl} alt={alt} />
        <AvatarFallback>{avatarFallback}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    // Object URLs are local browser resources and cannot be optimized by next/image.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      {...imageProps}
      src={imageUrl}
      alt={alt}
      className={cn('tw:block tw:max-w-full tw:object-cover', className)}
    />
  );
}

export { ImageFilePreview, useImageObjectUrl, type ImageFilePreviewProps };
