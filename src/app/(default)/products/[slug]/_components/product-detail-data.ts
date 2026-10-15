import { Expose, instanceToPlain, Transform } from 'class-transformer';

import type { LandingProductDetailDTO } from '@/entities/landing/landing.dto';
import type { ProductWeightDTO } from '@/entities/products/products.dto';
import { richTextToPlainText, type RichTextFormValue } from '@/lib/rich-text';
import { transform } from '@/lib/transform';

export type ProductGalleryImage = Readonly<{
  src?: string;
  alt: string;
  fit?: 'cover' | 'contain';
  placeholderImage?: string;
}>;

export type ProductPurchaseOption = Readonly<{
  payablePrice: number;
  previousPrice: number;
  quantity: number;
}>;

export type ProductDetailWeightViewModel = ProductPurchaseOption &
  Readonly<{
    id: string;
    label: string;
    cartWeight: ProductWeightDTO;
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
  if (typeof value === 'number') return value.toLocaleString();
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(displayValue).filter(Boolean).join('، ');
  return '';
}

function toProductPurchaseOption(
  price: number,
  discountPercentage: number,
  quantity: number,
): ProductPurchaseOption {
  return {
    payablePrice: Math.floor(price * (1 - discountPercentage / 100)),
    previousPrice: price,
    quantity,
  };
}

function toProductDetailWeights(product: LandingProductDetailDTO): ProductDetailWeightViewModel[] {
  return product.weights.map((weight, index) => {
    const id = weight._id ?? `${weight.metric}-${weight.value}-${index}`;
    const price = weight.price ?? product.price;
    const discountPercentage = weight.discountPercentage ?? product.discountPercentage;

    return {
      id,
      label: `${weight.value.toLocaleString()} ${weight.metric}`,
      cartWeight: { ...weight, _id: weight._id ?? id, price, discountPercentage },
      ...toProductPurchaseOption(price, discountPercentage, weight.quantity),
    };
  });
}

export class ProductDetailViewModel {
  @Expose()
  declare id: string;

  @Expose()
  declare slug: string;

  @Expose()
  declare title: string;

  @Expose()
  @Transform(({ value }) => value?.trim() ?? '', { toClassOnly: true })
  declare summary: string;

  @Expose()
  @Transform(
    ({ obj }) => {
      const descriptionText = richTextToPlainText(obj.description).trim();
      return descriptionText ? obj.description : null;
    },
    { toClassOnly: true },
  )
  declare description: RichTextFormValue | null;

  @Expose()
  @Transform(({ obj }) => richTextToPlainText(obj.description).trim(), { toClassOnly: true })
  declare descriptionText: string;

  @Expose()
  @Transform(({ obj }) => obj.category.petType?.displayName || obj.category.petType?.title || '', {
    toClassOnly: true,
  })
  declare animal: string;

  @Expose()
  @Transform(({ obj }) => obj.category.petType?.id ?? null, { toClassOnly: true })
  declare animalId: string | null;

  @Expose()
  @Transform(({ obj }) => relationTitle(obj.category), { toClassOnly: true })
  declare category: string;

  @Expose()
  @Transform(({ obj }) => obj.category.id, { toClassOnly: true })
  declare categoryId: string;

  @Expose()
  @Transform(({ obj }) => (obj.subCategory ? relationTitle(obj.subCategory) : null), {
    toClassOnly: true,
  })
  declare subCategory: string | null;

  @Expose()
  @Transform(({ obj }) => obj.subCategory?.id ?? null, { toClassOnly: true })
  declare subCategoryId: string | null;

  @Expose()
  @Transform(({ obj }) => relationTitle(obj.brand), { toClassOnly: true })
  declare brand: string;

  @Expose()
  @Transform(({ obj }) => obj.userRate, { toClassOnly: true })
  declare rating: number;

  @Expose()
  @Transform(({ obj }) => obj.userRateCount, { toClassOnly: true })
  declare reviewCount: number;

  @Expose()
  declare price: number;

  @Expose()
  @Transform(({ obj }) => Math.floor(obj.price * (1 - obj.discountPercentage / 100)), {
    toClassOnly: true,
  })
  declare payablePrice: number;

  @Expose()
  declare discountPercentage: number;

  @Expose()
  declare quantity: number;

  @Expose()
  @Transform(
    ({ obj }) => toProductPurchaseOption(obj.price, obj.discountPercentage, obj.quantity),
    {
      toClassOnly: true,
    },
  )
  declare purchase: ProductPurchaseOption;

  @Expose()
  declare canVote: boolean;

  @Expose()
  declare hasRated: boolean;

  @Expose()
  @Transform(
    ({ obj }) => {
      const sources = [obj.mainImage, ...obj.images].filter(
        (source, index, images) => source && images.indexOf(source) === index,
      );

      return sources.map((src, index) => ({
        src,
        alt: index === 0 ? obj.title : `${obj.title}، تصویر ${index + 1}`,
        placeholderImage: index === 0 ? obj.mainImageThumbnail : undefined,
      }));
    },
    { toClassOnly: true },
  )
  declare images: readonly ProductGalleryImage[];

  @Expose()
  @Transform(({ obj }) => toProductDetailWeights(obj), { toClassOnly: true })
  declare weights: readonly ProductDetailWeightViewModel[];

  @Expose()
  @Transform(
    ({ obj }) =>
      ((obj as LandingProductDetailDTO).category.petType?.propertyDefinitions ?? [])
        .map(({ label, value }) => ({ label: label.trim(), value: displayValue(value) }))
        .filter(({ label, value }) => label && value),
    { toClassOnly: true },
  )
  declare specifications: readonly Readonly<{ label: string; value: string }>[];
}

export function toProductDetailViewModel(product: LandingProductDetailDTO): ProductDetailViewModel {
  return instanceToPlain(transform(ProductDetailViewModel, product)) as ProductDetailViewModel;
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
  purchase: { payablePrice: 900_000, previousPrice: 1_000_000, quantity: 8 },
  canVote: false,
  hasRated: false,
  images: [{ src: undefined, alt: '' }],
  weights: [
    {
      id: 'weight-1',
      label: 'وزن محصول',
      cartWeight: {
        _id: 'weight-1',
        metric: 'KG',
        value: 1,
        price: 1_000_000,
        discountPercentage: 10,
        quantity: 1,
      },
      payablePrice: 900_000,
      previousPrice: 1_000_000,
      quantity: 1,
    },
    {
      id: 'weight-2',
      label: 'وزن محصول',
      cartWeight: {
        _id: 'weight-2',
        metric: 'KG',
        value: 2,
        price: 1_000_000,
        discountPercentage: 10,
        quantity: 1,
      },
      payablePrice: 900_000,
      previousPrice: 1_000_000,
      quantity: 1,
    },
  ],
  specifications: [
    { label: 'ویژگی محصول', value: 'مقدار ویژگی محصول' },
    { label: 'ویژگی محصول', value: 'مقدار ویژگی محصول' },
  ],
};
