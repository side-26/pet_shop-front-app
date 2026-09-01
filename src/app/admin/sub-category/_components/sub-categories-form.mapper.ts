import type { CategoryDTO } from '@/entities/categories/categories.dto';

import type { SubCategoryOption } from './sub-categories-form.types';

export function mapSubCategoryOptions(
  categories: readonly Pick<CategoryDTO, 'id' | 'title' | 'mainImage' | 'mainThumbnailImage'>[],
): SubCategoryOption[] {
  return categories.map(({ id, title, mainImage, mainThumbnailImage }) => ({
    value: id,
    title,
    mainImage,
    mainThumbnailImage,
  }));
}
