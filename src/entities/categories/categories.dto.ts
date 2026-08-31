import type {
  CategoryIdInput,
  CategoryInput,
  CategoryQueryInput,
  UpdateCategoryInput,
} from './categories.schema';

export type CategoryDTO = {
  id: string;
  title: string;
  petType: string;
  mainImage: string;
  mainThumbnailImage: string;
  slug: string;
  isEnable: boolean;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryIdDTO = CategoryIdInput;
export type CategoryQueryDTO = CategoryQueryInput;
export type CreateCategoryDTO = CategoryInput;
export type UpdateCategoryDTO = UpdateCategoryInput;
export type DeleteCategoryResultDTO = { id: string };
