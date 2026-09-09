import type { LandingProductDTO } from '@/entities/landing/landing.dto';

import type { OffersProductViewModel } from './offers-section.types';

export function mapOffersProducts(
  products: readonly LandingProductDTO[],
): OffersProductViewModel[] {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    mainImage: product.mainImage,
    mainImageThumbnail: product.mainImageThumbnail,
    price: product.price,
    discountPercentage: product.discountPercentage,
    discountPrice: product.discountPrice,
  }));
}
