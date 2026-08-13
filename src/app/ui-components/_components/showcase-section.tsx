import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

type ShowcaseSectionProps = Readonly<{
  id: string;
  title: string;
  description: string;
  children: ReactNode;
}>;

export function ShowcaseSection({ id, title, description, children }: ShowcaseSectionProps) {
  return (
    <Card id={id} variant="glass" size="lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="tw:flex tw:flex-col tw:gap-8">{children}</CardContent>
    </Card>
  );
}
