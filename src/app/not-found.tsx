import { ArrowLeft, Home, PawPrint } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

export default function NotFound() {
  return (
    <main className="tw:relative tw:isolate tw:flex tw:min-h-svh tw:items-center tw:overflow-hidden tw:bg-background tw:px-4 tw:py-10 tw:sm:px-6 tw:lg:px-8">
      <div
        className="tw:absolute tw:inset-x-0 tw:top-0 tw:-z-10 tw:h-2/3 tw:bg-linear-to-b tw:from-primary-muted tw:to-transparent"
        aria-hidden="true"
      />

      <PawPrint
        className="tw:absolute tw:top-[12%] tw:start-[8%] tw:-z-10 tw:size-14 tw:rotate-[-18deg] tw:text-primary/10 tw:sm:size-20"
        aria-hidden="true"
      />
      <PawPrint
        className="tw:absolute tw:end-[7%] tw:bottom-[14%] tw:-z-10 tw:size-20 tw:rotate-18 tw:text-secondary/15 tw:sm:size-28"
        aria-hidden="true"
      />

      <Card
        variant="glass"
        size="lg"
        className="tw:mx-auto tw:w-full tw:max-w-3xl tw:border-primary/15"
      >
        <div className="tw:flex tw:flex-col tw:py-2 tw:text-center">
          <CardHeader className="tw:items-center tw:gap-4">
            <div className="tw:flex tw:items-center tw:justify-center tw:gap-3">
              <span className="tw:text-display-l tw:font-extrabold tw:text-primary" dir="ltr">
                404
              </span>
              <span className="tw:grid tw:size-12 tw:place-items-center tw:rounded-2xl tw:bg-primary-muted tw:text-primary">
                <PawPrint className="tw:size-6" aria-hidden="true" />
              </span>
            </div>
            <CardTitle className="tw:text-headline-m tw:font-extrabold tw:sm:text-headline-l">
              انگار رد پنجه‌ها را گم کرده‌ایم!
            </CardTitle>
            <CardDescription className="tw:mx-auto tw:max-w-xl tw:text-body-l tw:leading-8">
              صفحه‌ای که دنبالش هستید پیدا نشد؛ شاید آدرس تغییر کرده یا این مسیر دیگر وجود ندارد. از
              مسیرهای زیر دوباره به جمع دوست‌های کوچکمان برگردید.
            </CardDescription>
          </CardHeader>

          <CardContent className="tw:pt-2">
            <p className="tw:text-label-m tw:text-muted-foreground">
              خبر خوب این است که خانه همیشه همین نزدیکی است.
            </p>
          </CardContent>

          <CardFooter className="tw:justify-center tw:pt-3">
            <Link href={routePaths.home} className={buttonVariants({ size: 'lg' })}>
              <Home data-icon="inline-start" aria-hidden="true" />
              بازگشت به خانه
            </Link>
            <Link
              href={routePaths.petsLanding}
              className={cn(buttonVariants({ variant: 'outlined', size: 'lg' }), 'tw:group')}
            >
              دیدن حیوانات
              <ArrowLeft
                data-icon="inline-end"
                className="tw:transition-transform tw:group-hover:-translate-x-1 tw:motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </CardFooter>
        </div>
      </Card>
    </main>
  );
}
