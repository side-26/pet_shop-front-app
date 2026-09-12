import type { Metadata } from 'next';

import { CareGuideSection } from './_components/care-guide/care-guide-section';
import { FeaturedProductsSection } from './_components/featured-products/featured-products-section';
import { ProductAssuranceSection } from './_components/assurance/product-assurance-section';
import { ProductCategoriesSection } from './_components/categories/product-categories-section';
import { ProductHeroSection } from './_components/hero/product-hero-section';
import { PopularBrandsSection } from './_components/popular-brands/popular-brands-section';

export const metadata: Metadata = {
  title: 'فروشگاه محصولات حیوانات خانگی | پت شاپ پرشین',
  description: 'محصولات منتخب برای تغذیه، بازی و مراقبت سگ، گربه، پرندگان و حیوانات کوچک.',
};

export default function ProductLandingPage() {
  return (
    <div className="tw:overflow-clip">
      <ProductHeroSection />
      <ProductAssuranceSection />
      <ProductCategoriesSection />
      <PopularBrandsSection />
      <FeaturedProductsSection />
      <CareGuideSection />
    </div>
  );
}
