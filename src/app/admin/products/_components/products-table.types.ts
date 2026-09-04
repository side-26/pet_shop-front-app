export type ProductTableRow = {
  id: string;
  title: string;
  category: string;
  subCategory: string;
  quantity: number;
  isEnable: boolean;
};

export type ProductsPageViewModel = {
  products: ProductTableRow[];
  page: number;
  pageCount: number;
  total: number;
};
