'use client';

import { DirectionProvider } from '@base-ui/react/direction-provider';

type RtlLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export function RtlLayout({ children }: RtlLayoutProps) {
  return <DirectionProvider direction="rtl">{children}</DirectionProvider>;
}
