import type { LandingProductDetailDTO } from '@/entities/landing/landing.dto';
import { richTextToPlainText, type RichTextFormValue } from '@/lib/rich-text';

export type ProductGalleryImage = Readonly<{
  src?: string;
  alt: string;
  fit?: 'cover' | 'contain';
  placeholder?: string;
}>;

export type ProductDetailViewModel = Readonly<{
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: RichTextFormValue | null;
  descriptionText: string;
  animal: string;
  animalId: string | null;
  category: string;
  categoryId: string;
  subCategory: string | null;
  subCategoryId: string | null;
  brand: string;
  rating: number;
  reviewCount: number;
  price: number;
  payablePrice: number;
  discountPercentage: number;
  quantity: number;
  canVote: boolean;
  hasRated: boolean;
  images: readonly ProductGalleryImage[];
  weights: readonly Readonly<{ id: string; label: string; quantity: number }>[];
  specifications: readonly Readonly<{ label: string; value: string }>[];
}>;

function relationTitle(value: { title?: unknown; title_fa?: unknown } | null | undefined) {
  return typeof value?.title_fa === 'string' && value.title_fa.trim()
    ? value.title_fa
    : typeof value?.title === 'string'
      ? value.title
      : '';
}

function displayValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'بله' : 'خیر';
  if (typeof value === 'number') return value.toLocaleString('fa-IR');
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(displayValue).filter(Boolean).join('، ');
  return '';
}

export function createProductDetailViewModel(
  product: LandingProductDetailDTO,
): ProductDetailViewModel {
  const descriptionText = richTextToPlainText(product.description).trim();
  const sources = [product.mainImage, ...product.images].filter(
    (source, index, images) => source && images.indexOf(source) === index,
  );

  return {
    id: product.id,
    slug: product.slug,
    title: product.title,
    summary: product.summary?.trim() ?? '',
    description: descriptionText ? product.description : null,
    descriptionText,
    animal: product.category.petType?.displayName || product.category.petType?.title || '',
    animalId: product.category.petType?.id ?? null,
    category: relationTitle(product.category),
    categoryId: product.category.id,
    subCategory: product.subCategory ? relationTitle(product.subCategory) : null,
    subCategoryId: product.subCategory?.id ?? null,
    brand: relationTitle(product.brand),
    rating: product.userRate,
    reviewCount: product.userRateCount,
    price: product.price,
    payablePrice: Math.floor(product.price * (1 - product.discountPercentage / 100)),
    discountPercentage: product.discountPercentage,
    quantity: product.quantity,
    canVote: product.canVote,
    hasRated: product.hasRated,
    images: sources.map((src, index) => ({
      src,
      alt: index === 0 ? product.title : `${product.title}، تصویر ${index + 1}`,
      placeholder: index === 0 ? product.mainImageThumbnail : undefined,
    })),
    weights: product.weights.map((weight, index) => ({
      id: weight._id ?? `${weight.metric}-${weight.value}-${index}`,
      label: `${weight.value.toLocaleString('fa-IR')} ${weight.metric}`,
      quantity: weight.quantity,
    })),
    specifications: (product.category.petType?.propertyDefinitions ?? [])
      .map(({ label, value }) => ({ label: label.trim(), value: displayValue(value) }))
      .filter(({ label, value }) => label && value),
  };
}

export const productDetailSkeleton: ProductDetailViewModel = {
  id: 'product-skeleton',
  slug: 'product-skeleton',
  title: 'عنوان محصول در این قسمت نمایش داده می‌شود',
  summary: 'خلاصه محصول در این قسمت نمایش داده می‌شود و فضای محتوای واقعی را حفظ می‌کند.',
  description: null,
  descriptionText: '',
  animal: 'نوع حیوان',
  animalId: null,
  category: 'دسته‌بندی',
  categoryId: 'category-skeleton',
  subCategory: 'زیردسته‌بندی',
  subCategoryId: null,
  brand: 'برند محصول',
  rating: 0,
  reviewCount: 0,
  price: 1_000_000,
  payablePrice: 900_000,
  discountPercentage: 10,
  quantity: 8,
  canVote: false,
  hasRated: false,
  images: [{ src: undefined, alt: '' }],
  weights: [
    { id: 'weight-1', label: 'وزن محصول', quantity: 1 },
    { id: 'weight-2', label: 'وزن محصول', quantity: 1 },
  ],
  specifications: [
    { label: 'ویژگی محصول', value: 'مقدار ویژگی محصول' },
    { label: 'ویژگی محصول', value: 'مقدار ویژگی محصول' },
  ],
};
