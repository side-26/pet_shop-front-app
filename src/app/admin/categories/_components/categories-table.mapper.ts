import type { CategoryDTO } from '@/entities/categories/categories.dto';

import type { CategoryTableRow } from './categories-table.types';

export function mapCategoriesTableRows(
  categories: CategoryDTO[],
  petTypeTitles: ReadonlyMap<string, string>,
): CategoryTableRow[] {
  return categories.map((category) => ({
    id: category.id,
    title: category.title,
    petTypeTitle: petTypeTitles.get(category.petType) ?? category.petType,
    mainImage: category.mainImage,
    mainThumbnailImage: category.mainThumbnailImage,
    isEnable: category.isEnable,
  }));
}
