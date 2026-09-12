export type OffersProductViewModel = Readonly<{
  id: string;
  title: string;
  mainImage: string;
  mainImageThumbnail?: string;
  price: number;
  discountPercentage: number;
  discountPrice: number;
}>;
