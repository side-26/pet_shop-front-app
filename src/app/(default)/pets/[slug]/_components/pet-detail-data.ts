import type { LandingPetDetailDTO } from '@/entities/landing/landing.dto';
import { richTextToPlainText, type RichTextFormValue } from '@/lib/rich-text';

export type PetDetailViewModel = Readonly<{
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: RichTextFormValue | null;
  descriptionText: string;
  petType: { id: string; title: string };
  breed: { id: string; title: string };
  rating: number;
  reviewCount: number;
  price: number;
  payablePrice: number;
  discountPercentage: number;
  quantity: number;
  images: readonly Readonly<{ src?: string; alt: string; placeholder?: string }>[];
  specifications: readonly Readonly<{ label: string; value: string }>[];
}>;

function displayValue(value: unknown): string {
  if (typeof value === 'boolean') return value ? 'بله' : 'خیر';
  if (typeof value === 'number') return value.toLocaleString('fa-IR');
  if (typeof value === 'string') return value.trim();
  if (Array.isArray(value)) return value.map(displayValue).filter(Boolean).join('، ');
  return '';
}

function relationSpecifications(
  relation: LandingPetDetailDTO['petType'] | LandingPetDetailDTO['breed'],
) {
  const definitions = relation.propertyDefinitions;
  return Array.isArray(definitions)
    ? definitions
        .map((definition) => {
          const value = definition as { label?: unknown; value?: unknown; defaultValue?: unknown };
          return {
            label: typeof value.label === 'string' ? value.label.trim() : '',
            value: displayValue(value.value ?? value.defaultValue),
          };
        })
        .filter(({ label, value }) => label && value)
    : [];
}

export function createPetDetailViewModel(pet: LandingPetDetailDTO): PetDetailViewModel {
  const descriptionText = richTextToPlainText(pet.description).trim();
  const imageSources = [pet.mainImage, ...pet.images].filter(
    (source, index, images) => source && images.indexOf(source) === index,
  );

  return {
    id: pet.id,
    slug: pet.slug,
    title: pet.title,
    summary: pet.summary?.trim() ?? '',
    description: descriptionText ? pet.description : null,
    descriptionText,
    petType: { id: pet.petType.id, title: pet.petType.title },
    breed: { id: pet.breed.id, title: pet.breed.title },
    rating: pet.userRate,
    reviewCount: pet.userRateCount,
    price: pet.price,
    payablePrice: Math.floor(pet.price * (1 - pet.discountPercentage / 100)),
    discountPercentage: pet.discountPercentage,
    quantity: pet.quantity,
    images: imageSources.map((src, index) => ({
      src,
      alt: index === 0 ? pet.title : `${pet.title}، تصویر ${index + 1}`,
      placeholder: index === 0 ? pet.mainImageThumbnail : undefined,
    })),
    specifications: [...relationSpecifications(pet.petType), ...relationSpecifications(pet.breed)],
  };
}

export const petDetailSkeleton: PetDetailViewModel = {
  id: 'pet-skeleton',
  slug: 'pet-skeleton',
  title: 'عنوان حیوان خانگی',
  summary: 'خلاصه‌ای از شرایط نگهداری و ویژگی‌های این حیوان خانگی در این بخش نمایش داده می‌شود.',
  description: null,
  descriptionText: '',
  petType: { id: 'pet-type-skeleton', title: 'نوع حیوان' },
  breed: { id: 'breed-skeleton', title: 'نژاد حیوان' },
  rating: 0,
  reviewCount: 0,
  price: 10_000_000,
  payablePrice: 9_000_000,
  discountPercentage: 10,
  quantity: 1,
  images: [
    { src: undefined, alt: '' },
    { src: undefined, alt: '' },
    { src: undefined, alt: '' },
  ],
  specifications: [
    { label: 'ویژگی حیوان', value: 'مقدار ویژگی' },
    { label: 'ویژگی نژاد', value: 'مقدار ویژگی' },
  ],
};
