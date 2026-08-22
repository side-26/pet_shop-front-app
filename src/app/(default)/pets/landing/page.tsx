import type { Metadata } from 'next';

import { PetHeroSection } from './_components/pet-hero-section';
import { PetTypesSection } from './_components/pet-types-section';
import { PopularPetsSection } from './_components/popular-pets-section';
import { RehomingSection } from './_components/rehoming-section';

export const metadata: Metadata = {
  title: 'حیوانات خانگی | پت‌شاپ پرمیوم',
  description:
    'دوست کوچک خود را میان حیوانات محبوب و حیوانات آماده واگذاری پت‌شاپ پرمیوم پیدا کنید.',
};

export default function PetLandingPage() {
  return (
    <div className="tw:overflow-clip tw:pb-8 tw:md:pb-12">
      <PetHeroSection />
      <PetTypesSection />
      <PopularPetsSection />
      <RehomingSection />
    </div>
  );
}
