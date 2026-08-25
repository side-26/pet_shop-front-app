'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger, type TabsProps } from '@/components/ui/tabs';

import { ShowcaseSection } from './showcase-section';

const colors = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'error',
] as const satisfies ReadonlyArray<NonNullable<TabsProps['color']>>;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies ReadonlyArray<
  NonNullable<TabsProps['size']>
>;

export function TabsShowcase() {
  return (
    <ShowcaseSection
      id="tabs"
      title="Tabs"
      description="زبانه‌های Base UI با رنگ و اندازه معنایی مشترک، ناوبری صفحه‌کلید RTL و وضعیت غیرفعال."
    >
      <div className="tw:flex tw:flex-col tw:gap-4">
        <h3 className="tw:text-title-s">رنگ‌ها</h3>
        <div className="tw:flex tw:flex-wrap tw:gap-4">
          {colors.map((color) => (
            <Tabs key={color} defaultValue="details" color={color} aria-label={`رنگ ${color}`}>
              <TabsList>
                <TabsTrigger value="details">جزئیات</TabsTrigger>
                <TabsTrigger value="reviews">دیدگاه‌ها</TabsTrigger>
              </TabsList>
            </Tabs>
          ))}
        </div>
      </div>
      <div className="tw:flex tw:flex-col tw:gap-4">
        <h3 className="tw:text-title-s">اندازه‌ها</h3>
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
          {sizes.map((size) => (
            <Tabs key={size} defaultValue="details" size={size} aria-label={`اندازه ${size}`}>
              <TabsList>
                <TabsTrigger value="details">جزئیات</TabsTrigger>
                <TabsTrigger value="reviews">دیدگاه‌ها</TabsTrigger>
              </TabsList>
            </Tabs>
          ))}
        </div>
      </div>
      <Tabs defaultValue="details" color="info" size="lg">
        <TabsList aria-label="بخش‌های خطی" variant="line">
          <TabsTrigger value="details">جزئیات</TabsTrigger>
          <TabsTrigger value="reviews">دیدگاه‌ها</TabsTrigger>
        </TabsList>
      </Tabs>
      <Tabs defaultValue="details" color="success">
        <TabsList aria-label="اطلاعات محصول">
          <TabsTrigger value="details">جزئیات</TabsTrigger>
          <TabsTrigger value="reviews">دیدگاه‌ها</TabsTrigger>
          <TabsTrigger value="questions" disabled>
            پرسش‌ها
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="tw:pt-4 tw:text-body-m">
          غذای کامل و متعادل برای سگ‌های بالغ.
        </TabsContent>
        <TabsContent value="reviews" className="tw:pt-4 tw:text-body-m">
          امتیاز کاربران و تجربه خرید در این بخش نمایش داده می‌شود.
        </TabsContent>
      </Tabs>
    </ShowcaseSection>
  );
}
