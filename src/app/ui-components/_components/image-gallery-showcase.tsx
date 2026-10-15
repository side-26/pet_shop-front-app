import { ImageGallery } from '@/components/common/image-gallery';

import { ShowcaseSection } from './showcase-section';

const galleryImages = [
  {
    src: '/images/home/product-dog-food.jpg',
    alt: 'غذای خشک سگ',
    placeholderImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  },
  {
    src: '/images/home/product-cat-litter.jpg',
    alt: 'خاک گربه',
    placeholderImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  },
  {
    src: '/images/home/product-water-fountain.jpg',
    alt: 'آبخوری حیوانات خانگی',
    placeholderImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  },
] as const;

export function ImageGalleryShowcase() {
  return (
    <ShowcaseSection
      id="image-galleries"
      title="Image Gallery"
      description="گالری واکنش‌گرا با پیش‌نمایش eager، placeholder برای هر تصویر و انتخاب تصویر با تغییرات transform بدون اندازه‌گیری چیدمان."
    >
      <ImageGallery ariaLabel="نمونه گالری محصول" className="tw:max-w-xl" images={galleryImages} />
    </ShowcaseSection>
  );
}
