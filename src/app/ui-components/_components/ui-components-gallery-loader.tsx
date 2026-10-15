'use client';

import dynamic from 'next/dynamic';

export const UiComponentsGalleryLoader = dynamic(
  () => import('./ui-components-gallery').then(({ UiComponentsGallery }) => UiComponentsGallery),
  { ssr: false },
);
