export type ProductTableRow = {
  id: string;
  mainImage: string;
  mainImageThumbnail: string;
  title: string;
  category: string;
  subCategory: string;
  quantity: number;
  price: number;
  isEnable: boolean;
};

export type ProductsPageViewModel = {
  products: ProductTableRow[];
  page: number;
  pageCount: number;
  total: number;
};
