export type ProductRelationOption = { id: string; title: string };
export type ProductSubCategoryOption = ProductRelationOption & { category: string };
export type ProductFormOptions = {
  categories: ProductRelationOption[];
  subCategories: ProductSubCategoryOption[];
};
