import type { BrandTableRow } from './brands-table.types';
const image = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';
export const brandsTableSkeletonData: BrandTableRow[] = Array.from({ length: 5 }, (_, index) => ({
  id: `skeleton-brand-${index}`,
  title: 'عنوان برند',
  titleFa: 'عنوان فارسی',
  description: 'توضیحات برند',
  logo: image,
  thumbnailLogo: image,
  isEnable: false,
}));
