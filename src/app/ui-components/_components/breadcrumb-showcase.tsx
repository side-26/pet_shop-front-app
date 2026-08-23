import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import { ShowcaseSection } from './showcase-section';

export function BreadcrumbShowcase() {
  return (
    <ShowcaseSection
      id="breadcrumbs"
      title="Breadcrumb"
      description="نمایش مسیر ناوبری با پیوندهای قابل دسترس و صفحهٔ فعلی در چیدمان راست‌به‌چپ."
    >
      <Breadcrumb aria-label="مسیر نمونه">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/" />}>خانه</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronLeft />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href="/products" />}>فروشگاه</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronLeft />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbPage>غذای گربه</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </ShowcaseSection>
  );
}
