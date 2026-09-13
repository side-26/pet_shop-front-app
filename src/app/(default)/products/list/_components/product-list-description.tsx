'use client';

import { ExpandableCard } from '@/components/ui/expandable-card';

const productListDescription =
  'پت شاپ پرشین، فروشگاه اینترنتی تخصصی برای خرید غذای سگ و گربه، لوازم حیوانات خانگی و محصولات موردنیاز نگهداری از پت است. در پت شاپ پرشین می‌توانید انواع غذای خشک و تر، تشویقی سگ و گربه، مکمل و ویتامین، محصولات بهداشتی، اسباب‌بازی، قلاده، جای خواب و سایر لوازم حیوانات خانگی را از برندهای معتبر با قیمت مناسب تهیه کنید. با تنوع بالای محصولات، مقایسه قیمت، تخفیف‌های ویژه و ارسال مطمئن، خرید آنلاین از پت شاپ پرشین برای صاحبان سگ، گربه و سایر حیوانات خانگی سریع، آسان و قابل اعتماد است.';

export function ProductListDescription() {
  return (
    <section aria-labelledby="product-list-description-title" className="tw:py-2">
      <ExpandableCard.Root size="sm" variant="outlined" className="tw:rounded-2xl">
        <ExpandableCard.Content collapsedHeight={130} className="tw:flex tw:flex-col tw:gap-3">
          <h2 id="product-list-description-title" className="tw:text-title-s">
            خرید آنلاین محصولات حیوانات خانگی
          </h2>
          <p className="tw:text-body-m tw:leading-8 tw:text-muted-foreground">
            {productListDescription}
          </p>
        </ExpandableCard.Content>
        <ExpandableCard.Trigger collapsedLabel="مشاهده بیشتر" expandedLabel="مشاهده کمتر" />
      </ExpandableCard.Root>
    </section>
  );
}
