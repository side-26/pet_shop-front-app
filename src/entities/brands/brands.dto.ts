import type { BrandIdInput, BrandInput, BrandQueryInput, UpdateBrandInput } from './brands.schema';

export type BrandDTO = {
  id: string;
  title: string;
  title_fa: string;
  logo?: string | null;
  thumbnailLogo?: string | null;
  slug: string;
  isEnable: boolean;
  description: unknown;
  createdAt: string;
  updatedAt: string;
};

export type BrandIdDTO = BrandIdInput;
export type BrandQueryDTO = BrandQueryInput;
export type CreateBrandDTO = BrandInput;
export type UpdateBrandDTO = UpdateBrandInput;
export type DeleteBrandResultDTO = { id: string };
