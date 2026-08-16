import type { ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';

type AuthFormCardProps = {
  titleId: string;
  title: ReactNode;
  description: ReactNode;
  children: ReactNode;
  footer: ReactNode;
};

export function AuthFormCard({ titleId, title, description, children, footer }: AuthFormCardProps) {
  return (
    <div className="tw:flex tw:min-w-0 tw:items-center tw:justify-center tw:text-foreground">
      <section
        aria-labelledby={titleId}
        className="tw:relative tw:flex tw:h-fit tw:w-full tw:max-w-md tw:flex-none tw:items-end tw:overflow-hidden tw:sm:max-lg:max-w-none tw:sm:max-lg:rounded-t-4xl tw:sm:max-lg:rounded-b-none tw:sm:max-lg:border"
      >
        <div aria-hidden="true" className="tw:absolute tw:inset-0 tw:bg-background/15" />

        <Card
          variant="glass"
          size="xs"
          className="tw:relative tw:size-full tw:gap-3 tw:rounded-t-4xl tw:rounded-b-none tw:border-border-strong tw:bg-card/85 tw:py-3 tw:sm:max-lg:rounded-t-4xl tw:sm:max-lg:rounded-b-none tw:[@media(max-height:430px)]:gap-1.5 tw:[@media(max-height:430px)]:rounded-t-3xl tw:[@media(max-height:430px)]:rounded-b-none tw:[@media(max-height:430px)]:py-2 tw:[@media(min-width:1025px)]:rounded-b-4xl"
        >
          <CardHeader className="tw:gap-1 tw:text-center tw:sm:max-lg:mx-auto tw:sm:max-lg:w-full tw:sm:max-lg:max-w-[430px]">
            <h1 id={titleId} className="tw:text-heading-3 tw:text-card-foreground">
              {title}
            </h1>
            <CardDescription className="tw:[@media(max-height:430px)]:hidden">
              {description}
            </CardDescription>
          </CardHeader>

          <CardContent className="tw:sm:max-lg:mx-auto tw:sm:max-lg:w-full tw:sm:max-lg:max-w-[430px]">
            {children}
          </CardContent>

          <CardFooter className="tw:justify-center tw:border-t tw:border-border/70 tw:text-center tw:sm:max-lg:mx-auto tw:sm:max-lg:w-full tw:sm:max-lg:max-w-[430px] tw:[@media(max-height:430px)]:pt-1.5">
            {footer}
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
