import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

export function ProfileOrdersSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-labelledby="orders-heading"
      className="skeleton tw:flex tw:pointer-events-none tw:flex-col tw:gap-4 tw:select-none"
    >
      <div className="tw:flex tw:flex-col tw:gap-1">
        <h2 id="orders-heading" className="tw:text-title-l">
          سفارش‌های من
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          وضعیت سفارش‌ها را ببینید و جزئیات ارسال را بررسی کنید.
        </p>
      </div>
      <div
        className="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-2 tw:lg:grid-cols-3"
        aria-hidden="true"
      >
        {Array.from({ length: 3 }, (_, index) => (
          <Card key={index} variant="outlined" size="md">
            <CardHeader>
              <div className="tw:h-6 tw:w-36 tw:rounded tw:bg-muted" />
              <div className="tw:h-4 tw:w-24 tw:rounded tw:bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="tw:grid tw:grid-cols-2 tw:gap-3">
                <div className="tw:h-12 tw:rounded tw:bg-muted" />
                <div className="tw:h-12 tw:rounded tw:bg-muted" />
              </div>
            </CardContent>
            <CardFooter>
              <div className="tw:ms-auto tw:h-10 tw:w-32 tw:rounded tw:bg-muted" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
