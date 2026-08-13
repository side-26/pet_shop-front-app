import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  type CardProps,
} from '@/components/ui/card';

import { ShowcaseSection } from './showcase-section';

const variants = [
  ['elevated', 'برجسته'],
  ['filled', 'پرشده'],
  ['outlined', 'خطی'],
  ['glass', 'شیشه‌ای'],
] as const satisfies ReadonlyArray<readonly [NonNullable<CardProps['variant']>, string]>;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies ReadonlyArray<
  NonNullable<CardProps['size']>
>;

export function CardShowcase() {
  return (
    <ShowcaseSection
      id="cards"
      title="Card"
      description="سطوح محتوایی کامل با هدر، توضیح، اکشن، محتوا و فوتر."
    >
      <div className="tw:grid tw:gap-5 tw:lg:grid-cols-2">
        {variants.map(([variant, label]) => (
          <Card key={variant} variant={variant} size="sm">
            <CardHeader>
              <CardTitle>کارت {label}</CardTitle>
              <CardDescription>نمونه‌ای از ترکیب کامل کارت در رابط راست‌به‌چپ.</CardDescription>
              <CardAction>
                <Badge color={variant === 'glass' ? 'info' : 'success'} variant="tonal">
                  {variant}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardContent>
              غذای خشک گربه با پروتئین بالا برای نژادهای بالغ؛ کد محصول <bdi>CAT-8420</bdi>.
            </CardContent>
            <CardFooter>
              <Button type="button" size="sm">
                مشاهده
              </Button>
              <Button type="button" size="sm" variant="flat">
                ذخیره
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="tw:flex tw:flex-col tw:gap-4">
        <h3 className="tw:text-title-s">مقیاس فاصله‌گذاری</h3>
        <div className="tw:grid tw:items-start tw:gap-4 tw:sm:grid-cols-2 tw:xl:grid-cols-5">
          {sizes.map((size) => (
            <Card key={size} size={size} variant="outlined">
              <CardHeader>
                <CardTitle>اندازه {size}</CardTitle>
                <CardDescription>فاصله‌گذاری داخلی هماهنگ</CardDescription>
              </CardHeader>
              <CardContent>محتوای نمونه</CardContent>
            </Card>
          ))}
        </div>
      </div>
    </ShowcaseSection>
  );
}
