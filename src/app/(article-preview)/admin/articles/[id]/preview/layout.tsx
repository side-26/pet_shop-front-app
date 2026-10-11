import { DefaultLayoutShell } from '@/components/layouts/default/default-layout-shell';

export default function ArticlePreviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DefaultLayoutShell>{children}</DefaultLayoutShell>;
}
