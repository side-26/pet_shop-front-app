import type { Metadata } from 'next';

import { BenefitsSection } from './_components/home/benefits-section';
import { CategoriesSection } from './_components/home/categories-section';
import { DeliverySection } from './_components/home/delivery-section';
import { HeroSection } from './_components/home/hero-section';
import { OffersSection } from './_components/home/offers-section';

export const metadata: Metadata = {
  title: 'پناهگاه پرشین | محصولات و مراقبت حیوانات خانگی',
  description: 'محصولات مطمئن، مراقبت حرفه‌ای و ارسال آسان برای حیوانات خانگی شما.',
};

export default function HomePage() {
  return (
    <div className="tw:overflow-clip">
      <HeroSection />
      <BenefitsSection />
      <CategoriesSection />
      <DeliverySection />
      <OffersSection />
    </div>
  );
}
