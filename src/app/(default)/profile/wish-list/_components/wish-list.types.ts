export type WishListItemViewModel = Readonly<{
  id: string;
  itemType: 'pet' | 'product';
  title: string;
  mainImage: string;
  thumbnailImage?: string;
}>;
