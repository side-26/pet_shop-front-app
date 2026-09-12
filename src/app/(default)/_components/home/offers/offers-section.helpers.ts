import type { OffersProductViewModel } from './offers-section.types';

export function createProductImageAlt(product: Pick<OffersProductViewModel, 'title'>) {
  return `تصویر محصول ${product.title}`;
}
