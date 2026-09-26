'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useAuthStore } from '@/entities/auth/auth.store';
import { addCartItemAction, deleteCartItemAction } from '@/entities/users/users.actions';
import type { CartDTO, CartItemDTO } from '@/entities/users/users.dto';
import type { ProductWeightDTO } from '@/entities/products/products.dto';

const CART_STORAGE_KEY = process.env.NEXT_PUBLIC_CART_STORAGE_KEY;

export type ProductCartItem = Readonly<{
  type: 'product';
  productId: string;
  weight: ProductWeightDTO;
  quantity: number;
  /** The authenticated cart-entry identifier, supplied by the cart API. */
  cartEntryId?: string;
}>;

export type PetCartItem = Readonly<{
  type: 'pet';
  petId: string;
  quantity: number;
  /** The authenticated cart-entry identifier, supplied by the cart API. */
  cartEntryId?: string;
}>;

export type CartItem = ProductCartItem | PetCartItem;
export type CartItemInput =
  Omit<ProductCartItem, 'quantity' | 'cartEntryId'> | Omit<PetCartItem, 'quantity' | 'cartEntryId'>;

export type CartOperationError = Readonly<{ message: string }>;
export type CartOperationResult =
  | Readonly<{ isSuccess: true; cart: CartDTO | null }>
  | Readonly<{ isSuccess: false; error: CartOperationError }>;

type CartActionResult = Awaited<ReturnType<typeof addCartItemAction>>;

type CartStore = {
  /** Rich client-side entries, persisted for guest carts and fast cart rendering. */
  items: CartItem[];
  /** The latest authoritative authenticated-cart response, when available. */
  serverCart: CartDTO | null;
  /** True only when guest changes still need to be copied to an authenticated cart. */
  needsServerSync: boolean;
  isSyncing: boolean;
  lastError: CartOperationError | null;

  addToCart: (item: CartItemInput, quantity?: number) => Promise<CartOperationResult>;
  removeFromCart: (item: CartItem) => Promise<CartOperationResult>;
  increaseQuantity: (item: CartItem) => Promise<CartOperationResult>;
  decreaseQuantity: (item: CartItem) => Promise<CartOperationResult>;
  setQuantity: (item: CartItem, quantity: number) => Promise<CartOperationResult>;
  /** Call this with the one server-cart request made by the `/cart` route. */
  hydrateFromServer: (cart: CartDTO) => void;
  /** Pushes the current locally persisted entries after authentication. */
  syncLocalToServer: () => Promise<CartOperationResult>;
  replaceItems: (items: CartItem[]) => void;
  clearCart: () => void;
  clearError: () => void;
};

function getWeightId(weight: ProductWeightDTO): string | null {
  return weight.id ?? weight._id ?? null;
}

function isPositiveInteger(value: number): boolean {
  return Number.isInteger(value) && value > 0;
}

function isNonNegativeInteger(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

function getItemKey(item: CartItem | CartItemInput): string {
  if (item.type === 'pet') return `pet:${item.petId}`;

  const weightId = getWeightId(item.weight);
  if (!weightId) throw new Error('A product cart item requires a weight id.');
  return `product:${item.productId}:${weightId}`;
}

function findCartItemIndex(items: readonly CartItem[], input: CartItemInput): number {
  const key = getItemKey(input);
  return items.findIndex((item) => getItemKey(item) === key);
}

function createCartItem(input: CartItemInput, quantity: number): CartItem {
  return { ...input, quantity } as CartItem;
}

function increaseCartItemQuantity(items: CartItem[], index: number, quantity: number): CartItem[] {
  return items.map((item, itemIndex) =>
    itemIndex === index ? { ...item, quantity: item.quantity + quantity } : item,
  ) as CartItem[];
}

function addOrIncrease(items: CartItem[], input: CartItemInput, quantity: number): CartItem[] {
  const index = findCartItemIndex(items, input);
  if (index < 0) return [...items, createCartItem(input, quantity)];

  return increaseCartItemQuantity(items, index, quantity);
}

function removeCartItem(items: CartItem[], target: CartItem): CartItem[] {
  const key = getItemKey(target);
  return items.filter((item) => getItemKey(item) !== key);
}

function setItemQuantity(items: CartItem[], target: CartItem, quantity: number): CartItem[] {
  if (quantity <= 0) return removeCartItem(items, target);

  const key = getItemKey(target);
  return items.map((item) =>
    getItemKey(item) === key ? { ...item, quantity } : item,
  ) as CartItem[];
}

function toCartItemInput(item: CartItem): CartItemInput {
  const { cartEntryId: _cartEntryId, quantity: _quantity, ...input } = item;
  return input;
}

function hasAuthenticatedUser() {
  return useAuthStore.getState().userIdentity !== null;
}

function isSuccessfulCartAction(
  result: CartActionResult,
): result is { isSuccess: true; message: string | null; data: CartDTO } {
  return result?.isSuccess === true;
}

function getFailedActionMessage(result: CartActionResult, fallback: string): string {
  return result?.message ?? fallback;
}

function toAddPayload(item: CartItemInput, quantity: number) {
  if (item.type === 'pet') return { itemId: item.petId, itemType: 'pet' as const, quantity };

  const weightId = getWeightId(item.weight);
  if (!weightId) throw new Error('A product cart item requires a weight id.');
  return { itemId: item.productId, itemType: 'product' as const, weightId, quantity };
}

function getServerItemId(item: CartItemDTO): string | null {
  if (typeof item.item === 'string') return item.item;
  if (!item.item || typeof item.item !== 'object') return null;

  const { id, _id } = item.item as { id?: unknown; _id?: unknown };
  const resolvedId = id ?? _id;
  return typeof resolvedId === 'string' ? resolvedId : null;
}

function getServerItemKey(item: CartItemDTO): string | null {
  const itemId = getServerItemId(item);
  if (!itemId) return null;
  if (item.itemType === 'pet') return `pet:${itemId}`;
  if (item.itemType === 'product' && item.weight) return `product:${itemId}:${item.weight}`;
  return null;
}

function createServerItemMap(cart: CartDTO): Map<string, CartItemDTO> {
  const entries = cart.items.flatMap((item) => {
    const key = getServerItemKey(item);
    return key ? [[key, item] as const] : [];
  });
  return new Map(entries);
}

function applyServerItem(item: CartItem, serverItem: CartItemDTO | undefined): CartItem {
  if (!serverItem) return item;
  return { ...item, quantity: serverItem.quantity, cartEntryId: serverItem._id };
}

function applyServerQuantities(items: CartItem[], cart: CartDTO): CartItem[] {
  const serverItems = createServerItemMap(cart);
  return items.map((item) => applyServerItem(item, serverItems.get(getItemKey(item))));
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      const finishSuccess = (cart: CartDTO | null): CartOperationResult => {
        set((state) => ({
          isSyncing: false,
          lastError: null,
          ...(cart ? { serverCart: cart, items: applyServerQuantities(state.items, cart) } : {}),
        }));
        return { isSuccess: true, cart };
      };
      const finishError = (message: string): CartOperationResult => {
        const error = { message };
        set({ isSyncing: false, lastError: error });
        return { isSuccess: false, error };
      };
      const finishGuestMutation = (updateItems: (items: CartItem[]) => CartItem[]) => {
        set(({ items }) => ({
          items: updateItems(items),
          needsServerSync: true,
          lastError: null,
        }));
        return finishSuccess(null);
      };

      return {
        items: [],
        serverCart: null,
        needsServerSync: false,
        isSyncing: false,
        lastError: null,

        addToCart: async (item, quantity = 1) => {
          if (!isPositiveInteger(quantity)) return finishError('Quantity must be at least one.');

          if (!hasAuthenticatedUser())
            return finishGuestMutation((items) => addOrIncrease(items, item, quantity));

          set({ isSyncing: true, lastError: null });
          const result = await addCartItemAction(toAddPayload(item, quantity));
          if (!isSuccessfulCartAction(result))
            return finishError(getFailedActionMessage(result, 'Unable to add the cart item.'));

          set(({ items }) => ({ items: addOrIncrease(items, item, quantity) }));
          return finishSuccess(result.data);
        },

        removeFromCart: async (item) => {
          if (!hasAuthenticatedUser())
            return finishGuestMutation((items) => removeCartItem(items, item));
          if (!item.cartEntryId)
            return finishError('The server cart entry id is required to remove this item.');

          set({ isSyncing: true, lastError: null });
          const result = await deleteCartItemAction({ id: item.cartEntryId });
          if (!isSuccessfulCartAction(result))
            return finishError(getFailedActionMessage(result, 'Unable to remove the cart item.'));

          set(({ items }) => ({ items: setItemQuantity(items, item, 0) }));
          return finishSuccess(result.data);
        },

        increaseQuantity: async (item) => {
          return get().addToCart(toCartItemInput(item), 1);
        },

        decreaseQuantity: async (item) => {
          if (item.quantity <= 1) return get().removeFromCart(item);
          if (hasAuthenticatedUser()) {
            return finishError('The cart API does not expose a quantity-decrease endpoint.');
          }

          return finishGuestMutation((items) => setItemQuantity(items, item, item.quantity - 1));
        },

        setQuantity: async (item, quantity) => {
          if (!isNonNegativeInteger(quantity)) return finishError('Quantity cannot be negative.');
          if (quantity === 0) return get().removeFromCart(item);
          if (quantity === item.quantity) return finishSuccess(get().serverCart);

          if (quantity > item.quantity) {
            return get().addToCart(toCartItemInput(item), quantity - item.quantity);
          }

          if (hasAuthenticatedUser()) {
            return finishError('The cart API does not expose a quantity-update endpoint.');
          }

          return finishGuestMutation((items) => setItemQuantity(items, item, quantity));
        },

        hydrateFromServer: (cart) =>
          set((state) => ({
            serverCart: cart,
            items: applyServerQuantities(state.items, cart),
            lastError: null,
          })),

        syncLocalToServer: async () => {
          if (!hasAuthenticatedUser()) return finishError('Sign in before syncing the cart.');
          if (!get().needsServerSync) return finishSuccess(get().serverCart);

          set({ isSyncing: true, lastError: null });
          let latestCart: CartDTO | null = get().serverCart;
          for (const item of get().items) {
            const result = await addCartItemAction(
              toAddPayload(toCartItemInput(item), item.quantity),
            );
            if (!isSuccessfulCartAction(result))
              return finishError(getFailedActionMessage(result, 'Unable to sync the cart.'));
            latestCart = result.data;
          }
          set({ needsServerSync: false });
          return finishSuccess(latestCart);
        },

        replaceItems: (items) => set({ items, lastError: null }),
        clearCart: () =>
          set({
            items: [],
            serverCart: null,
            needsServerSync: false,
            lastError: null,
            isSyncing: false,
          }),
        clearError: () => set({ lastError: null }),
      };
    },
    {
      name: CART_STORAGE_KEY ?? 'cart',
      storage: createJSONStorage(() => localStorage),
      partialize: ({ items, serverCart, needsServerSync }) => ({
        items,
        serverCart,
        needsServerSync,
      }),
    },
  ),
);
