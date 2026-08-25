import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { routePaths } from '@/configs/route.path';

export function ProductListBreadcrumb() {
  return (
    <Breadcrumb aria-label="مسیر صفحه">
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={routePaths.home} />}>خانه</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronLeft />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link href={routePaths.products} />}>فروشگاه</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>
          <ChevronLeft />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>محصولات</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
