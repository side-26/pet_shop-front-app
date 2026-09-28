import type { CartCatalogItemDTO, CartDTO } from '@/entities/users/users.dto';
import type { CartItem as StoreCartItem } from '@/stores/cart.store';

export type CartItem = Readonly<{
  id: string;
  title: string;
  image: string;
  detail: string;
  price: number;
  previousPrice?: number;
  quantity: number;
  stock: number;
  cartItem: StoreCartItem;
}>;

function isCartCatalogItem(item: unknown): item is CartCatalogItemDTO {
  if (!item || typeof item !== 'object') return false;

  const value = item as Partial<CartCatalogItemDTO>;
  return (
    typeof value._id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.mainImage === 'string' &&
    typeof value.price === 'number' &&
    typeof value.discountPercentage === 'number'
  );
}

export function createCartItems(items: CartDTO['items']): CartItem[] {
  return items.flatMap((entry) => {
    if (!entry._id || !isCartCatalogItem(entry.item)) return [];

    const selectedWeight =
      entry.itemType === 'product'
        ? entry.item.weights?.find((weight) => (weight.id ?? weight._id) === entry.weight)
        : undefined;
    const productCartItem =
      entry.itemType === 'product' && selectedWeight
        ? {
            type: 'product' as const,
            productId: entry.item._id,
            cartEntryId: entry._id,
            quantity: entry.quantity,
            weight: selectedWeight,
          }
        : null;
    if (entry.itemType === 'product' && !productCartItem) return [];

    const price = selectedWeight?.price ?? entry.item.price;
    const discountPercentage = selectedWeight?.discountPercentage ?? entry.item.discountPercentage;
    const discount = (price * discountPercentage) / 100;
    const cartItem: StoreCartItem = productCartItem ?? {
      type: 'pet',
      petId: entry.item._id,
      cartEntryId: entry._id,
      quantity: entry.quantity,
    };
    return {
      id: entry._id,
      title: entry.item.title,
      image: entry.item.mainImage,
      detail: selectedWeight ? `${selectedWeight.value} ${selectedWeight.metric}` : 'پیش‌سفارش',
      price: price - discount,
      ...(discount > 0 ? { previousPrice: price } : {}),
      quantity: entry.quantity,
      stock: selectedWeight?.quantity ?? entry.item.quantity ?? entry.quantity,
      cartItem,
    };
  });
}
