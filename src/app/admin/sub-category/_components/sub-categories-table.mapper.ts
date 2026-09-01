import type { CategoryDTO } from '@/entities/categories/categories.dto';
import type { SubCategoryDTO } from '@/entities/sub-categories/sub-categories.dto';

import type { SubCategoryTableRow } from './sub-categories-table.types';

export function mapSubCategoriesTableRows(
  subCategories: SubCategoryDTO[],
  categories: readonly Pick<CategoryDTO, 'id' | 'title' | 'petType'>[],
  petTypeTitles: ReadonlyMap<string, string>,
): SubCategoryTableRow[] {
  const categoriesById = new Map(categories.map((category) => [category.id, category]));

  return subCategories.map((subCategory) => {
    const category = categoriesById.get(subCategory.category);

    return {
      id: subCategory.id,
      title: subCategory.title,
      categoryTitle: category?.title ?? '_',
      petTypeTitle: petTypeTitles.get(category?.petType ?? '') ?? '_',
    };
  });
}
