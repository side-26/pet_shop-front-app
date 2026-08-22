import { DefaultLayoutShell } from '@/components/layouts/default/default-layout-shell';

type DefaultLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function DefaultLayout({ children }: DefaultLayoutProps) {
  return <DefaultLayoutShell>{children}</DefaultLayoutShell>;
}
