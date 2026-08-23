import type { Metadata } from 'next';

import { ProductListContent } from './_components/product-list-content';

export const metadata: Metadata = {
  title: 'فهرست محصولات حیوانات خانگی | پناهگاه پرشین',
  description: 'خرید محصولات منتخب تغذیه، بازی و مراقبت سگ و گربه.',
};

export default function ProductListPage() {
  return <ProductListContent />;
}
