import type { Metadata } from 'next';

import { PetHeroSection } from './landing/_components/hero/pet-hero-section';
import { PetTypesSection } from './landing/_components/pet-types/pet-types-section';
import { PopularPetsSection } from './landing/_components/popular-pets/popular-pets-section';
import { RehomingSection } from './landing/_components/rehoming/rehoming-section';

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
