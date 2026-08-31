import type { Metadata } from 'next';
import { PetTypesPageContentWrapper } from './_components/pet-types-page-content-wrapper';
import { PetTypesHeaderActions } from './_components/pet-types-header-actions';
export const metadata: Metadata = {
  title: 'مدیریت انواع حیوان | پت‌شاپ',
  description: 'مشاهده و مدیریت انواع حیوان پت‌شاپ',
};
export default function AdminPetTypesPage() {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <PetTypesHeaderActions />
      <PetTypesPageContentWrapper />
    </article>
  );
}
