import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';

import { CareGuideSection } from './_components/care-guide-section';
import { FeaturedProductsSection } from './_components/featured-products-section';
import { ProductAssuranceSection } from './_components/product-assurance-section';
import { ProductCategoriesSection } from './_components/product-categories-section';
import { ProductHeroSection } from './_components/product-hero-section';

export const metadata: Metadata = {
  title: 'فروشگاه محصولات حیوانات خانگی | پناهگاه پرشین',
  description: 'محصولات منتخب برای تغذیه، بازی و مراقبت سگ، گربه، پرندگان و حیوانات کوچک.',
};

export default async function ProductLandingPage() {
  'use cache';
  cacheLife('max');

  return (
    <div className="tw:overflow-clip">
      <ProductHeroSection />
      <ProductAssuranceSection />
      <ProductCategoriesSection />
      <FeaturedProductsSection />
      <CareGuideSection />
    </div>
  );
}
