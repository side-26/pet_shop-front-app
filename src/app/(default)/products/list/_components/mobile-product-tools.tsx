import { ArrowDownUp, SlidersHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { ProductFilters } from './product-filters';

const sortOptions = ['محبوب‌ترین', 'جدیدترین', 'ارزان‌ترین', 'گران‌ترین'] as const;

export function MobileProductTools() {
  return (
    <div className="tw:sticky tw:top-20 tw:z-20 tw:grid tw:grid-cols-2 tw:gap-2 tw:rounded-2xl tw:border tw:border-border/60 tw:bg-background/90 tw:p-2 tw:shadow-lg tw:shadow-foreground/5 tw:supports-backdrop-filter:backdrop-blur-xl tw:lg:hidden">
      <Dialog>
        <DialogTrigger render={<Button variant="tonal" color="secondary" block />}>
          <SlidersHorizontal data-icon="inline-start" aria-hidden="true" />
          فیلترها
        </DialogTrigger>
        <DialogContent size="lg">
          <DialogTitle>فیلتر محصولات</DialogTitle>
          <DialogDescription>نوع حیوان و دسته‌بندی محصول را انتخاب کنید.</DialogDescription>
          <ProductFilters compact />
        </DialogContent>
      </Dialog>
      <Dialog>
        <DialogTrigger render={<Button variant="outlined" block />}>
          <ArrowDownUp data-icon="inline-start" aria-hidden="true" />
          مرتب‌سازی
        </DialogTrigger>
        <DialogContent size="sm">
          <DialogTitle>مرتب‌سازی محصولات</DialogTitle>
          <DialogDescription>ترتیب نمایش محصولات را انتخاب کنید.</DialogDescription>
          <div className="tw:flex tw:flex-col tw:gap-2">
            {sortOptions.map((option, index) => (
              <Button
                key={option}
                variant={index === 0 ? 'tonal' : 'flat'}
                color={index === 0 ? 'primary' : 'secondary'}
                block
              >
                {option}
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
