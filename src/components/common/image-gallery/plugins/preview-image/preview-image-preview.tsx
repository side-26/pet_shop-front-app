import type { ReactNode } from 'react';

type PreviewImagePreviewProps = Readonly<{
  children: ReactNode;
}>;

export function PreviewImagePreview({ children }: PreviewImagePreviewProps) {
  return children;
}
