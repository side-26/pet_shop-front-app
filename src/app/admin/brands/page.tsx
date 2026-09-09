import type { Metadata } from 'next';
import { BrandsHeaderActions } from './_components/brands-header-actions';
import { BrandsTableWrapper } from './_components/brands-table-wrapper';
export const metadata: Metadata = {
  title: 'مدیریت برندها | پت‌شاپ',
  description: 'مشاهده و مدیریت برندها',
};
export default function AdminBrandsPage() {
  return (
    <article className="tw:flex tw:min-h-0 tw:size-full tw:flex-col tw:p-3 tw:sm:p-4">
      <BrandsHeaderActions />
      <BrandsTableWrapper />
    </article>
  );
}
