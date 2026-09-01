import type {
  SubCategoryIdInput,
  SubCategoryInput,
  SubCategoryQueryInput,
  UpdateSubCategoryInput,
} from './sub-categories.schema';

export type SubCategoryDTO = {
  id: string;
  title: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type SubCategoryIdDTO = SubCategoryIdInput;
export type SubCategoryQueryDTO = SubCategoryQueryInput;
export type CreateSubCategoryDTO = SubCategoryInput;
export type UpdateSubCategoryDTO = UpdateSubCategoryInput;
export type DeleteSubCategoryResultDTO = { id: string };
