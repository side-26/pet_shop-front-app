export type ProductRelationOption = {
  id: string;
  title: string;
  petTypeTitle: string;
  mainImage: string;
  mainThumbnailImage: string;
};
export type ProductSubCategoryOption = { id: string; title: string; category: string };
export type ProductBrandOption = {
  id: string;
  title: string;
  logo?: string | null;
  thumbnailLogo?: string | null;
};
export type ProductFormOptions = {
  categories: ProductRelationOption[];
  subCategories: ProductSubCategoryOption[];
  brands: ProductBrandOption[];
};
