import type { BreedsPageDTO } from '@/entities/breeds/breeds.dto';

import type { BreedsPageViewModel } from './breeds-table.types';

const sizeLabels = ['بسیار کوچک', 'کوچک', 'متوسط', 'بزرگ', 'بسیار بزرگ'] as const;
const activityLabels = ['بسیار کم', 'کم', 'متوسط', 'زیاد', 'بسیار زیاد'] as const;

function normalizeTotal(value: unknown, fallback: number) {
  const total = Number(value);
  return Number.isFinite(total) && total >= 0 ? total : fallback;
}

export function mapBreedsPageViewModel(
  data: BreedsPageDTO,
  petTypeTitles: ReadonlyMap<string, string> = new Map(),
): BreedsPageViewModel {
  const breeds = data?.result?.map((breed) => ({
    id: breed.id,
    title: breed.title,
    petTypeTitle: breed.petTypeTitle ?? petTypeTitles.get(breed.petType) ?? breed.petType,
    country: breed.country ?? '',
    ageAverage: breed.ageAverage,
    size: sizeLabels[breed.size] ?? String(breed.size),
    activityLevel:
      breed.activityLevel == null
        ? ''
        : (activityLabels[breed.activityLevel] ?? String(breed.activityLevel)),
    mainImage: breed.mainImage,
    thumbnailImage: breed.thumbnailImage,
    isEnabled: breed.enable,
  }));

  return {
    breeds,
    page: Math.max(1, data.pagination.currentPage),
    pageCount: Math.max(1, data.pagination.totalPages),
    total: normalizeTotal(data.pagination.totalItems, breeds.length),
  };
}
