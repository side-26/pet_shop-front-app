import type { Metadata } from 'next';
import { BookOpenTextIcon, PawPrintIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'مقالات | پت‌شاپ پرشین',
  description: 'راهنماهای کاربردی و خواندنی برای مراقبت بهتر از حیوانات خانگی.',
};

export const instant = true;

export default function ArticlesPage() {
  return (
    <article className="tw:default-layout-container tw:py-10 tw:sm:py-14 tw:lg:py-20">
      <header className="tw:mx-auto tw:flex tw:max-w-3xl tw:flex-col tw:items-center tw:text-center">
        <Badge color="primary" size="lg" variant="transparent">
          <PawPrintIcon aria-hidden="true" />
          مجله پت‌شاپ پرشین
        </Badge>
        <h1 className="tw:mt-5 tw:text-heading-1 tw:text-balance tw:sm:text-display-l">
          راهنمایی برای زندگی بهتر کنار <span className="tw:text-primary">دوست پشمالوی شما</span>
        </h1>
        <p className="tw:mt-4 tw:max-w-2xl tw:text-body-m tw:leading-8 tw:text-muted-foreground tw:sm:text-body-l">
          اینجا برای پیدا کردن جواب‌های ساده و کاربردی درباره مراقبت، تغذیه و حال خوب حیوانات خانگی
          ساخته شده است.
        </p>
      </header>

      <Card className="tw:mx-auto tw:mt-10 tw:max-w-3xl" size="lg" variant="filled">
        <CardHeader className="tw:justify-items-center tw:text-center">
          <span className="tw:flex tw:size-12 tw:items-center tw:justify-center tw:rounded-2xl tw:bg-primary-muted tw:text-primary">
            <BookOpenTextIcon aria-hidden="true" />
          </span>
          <CardTitle>اولین مقاله‌ها در راه‌اند</CardTitle>
          <CardDescription>
            به‌زودی راهنماهای دقیق و قابل‌اعتماد را اینجا می‌خوانید.
          </CardDescription>
        </CardHeader>
        <CardContent className="tw:text-center tw:text-body-s tw:text-muted-foreground">
          تا آن زمان می‌توانید از محصولات و دسته‌بندی‌های فروشگاه دیدن کنید.
        </CardContent>
      </Card>
    </article>
  );
}
