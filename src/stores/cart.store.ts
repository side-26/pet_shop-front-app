'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { useAuthStore } from '@/entities/auth/auth.store';
import {
  addCartItemAction,
  deleteCartItemAction,
  emptyCartAction,
  getCartForSyncAction,
} from '@/entities/users/users.actions';
import type { CartCatalogItemDTO, CartDTO } from '@/entities/users/users.dto';
import type { ProductWeightDTO } from '@/entities/products/products.dto';

const CART_STORAGE_KEY = process.env.NEXT_PUBLIC_CART_STORAGE_KEY;

export type ProductCartItem = Readonly<{
  type: 'product';
  productId: string;
  weight: ProductWeightDTO;
  quantity: number;
  /** The authenticated cart-entry identifier, supplied by the cart API. */
  cartEntryId?: string;
  /** Last local or server update for this cart line. */
  updatedAt?: string;
}>;

export type PetCartItem = Readonly<{
  type: 'pet';
  petId: string;
  quantity: number;
  /** The authenticated cart-entry identifier, supplied by the cart API. */
  cartEntryId?: string;
  /** Last local or server update for this cart line. */
  updatedAt?: string;
}>;

export type CartItem = ProductCartItem | PetCartItem;
export type CartItemInput =
  | Omit<ProductCartItem, 'quantity' | 'cartEntryId' | 'updatedAt'>
  | Omit<PetCartItem, 'quantity' | 'cartEntryId' | 'updatedAt'>;

export type CartOperationError = Readonly<{ message: string }>;
export type CartOperationResult =
  | Readonly<{ isSuccess: true; cart: CartDTO | null }>
  | Readonly<{ isSuccess: false; error: CartOperationError }>;

export type PendingCartAddOperation = Readonly<{
  idempotencyKey: string;
  item: CartItemInput;
  quantity: number;
}>;

type CartActionResult = Awaited<ReturnType<typeof addCartItemAction>>;
type GetCartForSyncActionResult = Awaited<ReturnType<typeof getCartForSyncAction>>;

let cartSyncPromise: Promise<CartOperationResult> | null = null;

type CartStore = {
  /** Rich client-side entries, persisted for guest carts and fast cart rendering. */
  items: CartItem[];
  /** The latest authoritative authenticated-cart response, when available. */
  serverCart: CartDTO | null;
  /** True only when guest changes still need to be copied to an authenticated cart. */
  needsServerSync: boolean;
  /** The account that owns the persisted cart, or null when it is a guest cart awaiting merge. */
  cartUserId: string | null;
  /** Last local-cart snapshot update, retained for deterministic server reconciliation. */
  guestCartUpdatedAt: string | null;
  /** Deletion timestamps let a newer local removal win over an older server line. */
  itemTombstones: Record<string, string>;
  /** Persisted add operations awaiting an idempotent server confirmation. */
  pendingAddOperations: PendingCartAddOperation[];
  isSyncing: boolean;
  lastError: CartOperationError | null;

  addToCart: (item: CartItemInput, quantity?: number) => Promise<CartOperationResult>;
  removeFromCart: (item: CartItem) => Promise<CartOperationResult>;
  increaseQuantity: (item: CartItem) => Promise<CartOperationResult>;
  decreaseQuantity: (item: CartItem) => Promise<CartOperationResult>;
  emptyCart: () => Promise<CartOperationResult>;
  setQuantity: (item: CartItem, quantity: number) => Promise<CartOperationResult>;
  /** Returns whether this exact product and weight pair is currently in the cart. */
  hasProductWeight: (productId: string, weightId: string) => boolean;
  /** Returns whether this exact pet is currently in the cart. */
  hasPet: (petId: string) => boolean;
  /** Call this with the one server-cart request made by the `/cart` route. */
  hydrateFromServer: (cart: CartDTO) => void;
  /** Retries the persisted outbox and copies pending guest entries after authentication. */
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

function preserveOrUpdateItemTimestamps(
  previousItems: readonly CartItem[],
  nextItems: readonly CartItem[],
  updatedAt: string,
): CartItem[] {
  const previousByKey = new Map(previousItems.map((item) => [getItemKey(item), item]));
  return nextItems.map((item) => {
    const previous = previousByKey.get(getItemKey(item));
    if (!previous || previous.quantity !== item.quantity) return { ...item, updatedAt } as CartItem;
    return { ...item, updatedAt: previous.updatedAt } as CartItem;
  });
}

function createItemTombstones(
  previousItems: readonly CartItem[],
  nextItems: readonly CartItem[],
  currentTombstones: Readonly<Record<string, string>>,
  updatedAt: string,
): Record<string, string> {
  const nextKeys = new Set(nextItems.map(getItemKey));
  const tombstones = { ...currentTombstones };
  previousItems.forEach((item) => {
    const key = getItemKey(item);
    if (!nextKeys.has(key)) tombstones[key] = updatedAt;
  });
  nextItems.forEach((item) => delete tombstones[getItemKey(item)]);
  return tombstones;
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
  const { cartEntryId: _cartEntryId, quantity: _quantity, updatedAt: _updatedAt, ...input } = item;
  return input;
}

function hasAuthenticatedUser() {
  return useAuthStore.getState().userIdentity !== null;
}

function getAuthenticatedUserId() {
  return useAuthStore.getState().userIdentity?.userId ?? null;
}

function isSuccessfulCartAction(
  result: CartActionResult | GetCartForSyncActionResult,
): result is { isSuccess: true; message: string | null; data: CartDTO } {
  return result?.isSuccess === true;
}

function getFailedActionMessage(result: CartActionResult, fallback: string): string {
  return result?.message ?? fallback;
}

function toAddPayload(item: CartItemInput, quantity: number, idempotencyKey = crypto.randomUUID()) {
  if (item.type === 'pet')
    return { itemId: item.petId, itemType: 'pet' as const, quantity, idempotencyKey };

  const weightId = getWeightId(item.weight);
  if (!weightId) throw new Error('A product cart item requires a weight id.');
  return {
    itemId: item.productId,
    itemType: 'product' as const,
    weightId,
    quantity,
    idempotencyKey,
  };
}

function createPendingAddOperation(item: CartItemInput, quantity: number): PendingCartAddOperation {
  return { item, quantity, idempotencyKey: crypto.randomUUID() };
}

function findPendingAddOperation(
  item: CartItem,
  pendingOperations: readonly PendingCartAddOperation[],
): PendingCartAddOperation | undefined {
  const input = toCartItemInput(item);
  return pendingOperations.find(
    (operation) =>
      getItemKey(operation.item) === getItemKey(input) && operation.quantity === item.quantity,
  );
}

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

type ServerCartEntry = CartDTO['items'][number];

function findEntryWeight(entry: ServerCartEntry, item: CartCatalogItemDTO) {
  return item.weights?.find((candidate) => (candidate.id ?? candidate._id) === entry.weight);
}

function createPetCartItemFromServer(
  entry: ServerCartEntry,
  item: CartCatalogItemDTO,
  cartUpdatedAt: string | undefined,
): PetCartItem {
  return {
    type: 'pet',
    petId: item._id,
    cartEntryId: entry._id,
    quantity: entry.quantity,
    updatedAt: entry.updatedAt ?? cartUpdatedAt,
  };
}

function createProductCartItemFromServer(
  entry: ServerCartEntry,
  item: CartCatalogItemDTO,
  cartUpdatedAt: string | undefined,
): ProductCartItem | null {
  const weight = findEntryWeight(entry, item);
  if (!weight) return null;

  return {
    type: 'product',
    productId: item._id,
    cartEntryId: entry._id,
    quantity: entry.quantity,
    weight,
    updatedAt: entry.updatedAt ?? cartUpdatedAt,
  };
}

function createCartItemFromServer(
  entry: ServerCartEntry,
  cartUpdatedAt: string | undefined,
): CartItem | null {
  if (!entry._id || !isCartCatalogItem(entry.item)) return null;
  if (entry.itemType === 'pet')
    return createPetCartItemFromServer(entry, entry.item, cartUpdatedAt);
  if (entry.itemType === 'product')
    return createProductCartItemFromServer(entry, entry.item, cartUpdatedAt);
  return null;
}

function createCartItemsFromServer(cart: CartDTO): CartItem[] {
  return cart.items.flatMap((entry) => {
    const item = createCartItemFromServer(entry, cart.updatedAt);
    return item ? [item] : [];
  });
}

function timestamp(value: string | null | undefined): number | null {
  if (!value) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function isLocalCartNewer(
  localUpdatedAt: string | null | undefined,
  serverUpdatedAt: string | undefined,
) {
  const localTime = timestamp(localUpdatedAt);
  const serverTime = timestamp(serverUpdatedAt);
  return localTime !== null && (serverTime === null || localTime > serverTime);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => {
      const finishSuccess = (cart: CartDTO | null): CartOperationResult => {
        set((state) => ({
          isSyncing: false,
          lastError: null,
          ...(cart
            ? {
                serverCart: cart,
                items: createCartItemsFromServer(cart),
                cartUserId: getAuthenticatedUserId(),
                guestCartUpdatedAt: null,
                itemTombstones: {},
                needsServerSync: false,
                pendingAddOperations: [],
              }
            : {}),
        }));
        return { isSuccess: true, cart };
      };
      const finishError = (message: string): CartOperationResult => {
        const error = { message };
        set({ isSyncing: false, lastError: error });
        return { isSuccess: false, error };
      };
      const finishGuestMutation = (updateItems: (items: CartItem[]) => CartItem[]) => {
        const updatedAt = new Date().toISOString();
        set(({ items, itemTombstones }) => {
          const nextItems = updateItems(items);
          return {
            items: preserveOrUpdateItemTimestamps(items, nextItems, updatedAt),
            itemTombstones: createItemTombstones(items, nextItems, itemTombstones, updatedAt),
            needsServerSync: true,
            cartUserId: null,
            guestCartUpdatedAt: updatedAt,
            lastError: null,
          };
        });
        return finishSuccess(null);
      };

      return {
        items: [],
        serverCart: null,
        needsServerSync: false,
        cartUserId: null,
        guestCartUpdatedAt: null,
        itemTombstones: {},
        pendingAddOperations: [],
        isSyncing: false,
        lastError: null,

        addToCart: async (item, quantity = 1) => {
          if (!isPositiveInteger(quantity)) return finishError('Quantity must be at least one.');

          if (!hasAuthenticatedUser())
            return finishGuestMutation((items) => addOrIncrease(items, item, quantity));

          const operation = createPendingAddOperation(item, quantity);
          const updatedAt = new Date().toISOString();
          set(({ items, itemTombstones }) => {
            const nextItems = addOrIncrease(items, item, quantity);
            return {
              items: preserveOrUpdateItemTimestamps(items, nextItems, updatedAt),
              itemTombstones: createItemTombstones(items, nextItems, itemTombstones, updatedAt),
              isSyncing: true,
              lastError: null,
              cartUserId: getAuthenticatedUserId(),
              guestCartUpdatedAt: null,
            };
          });

          const result = await addCartItemAction(
            toAddPayload(operation.item, operation.quantity, operation.idempotencyKey),
          );
          if (!isSuccessfulCartAction(result)) {
            const error = {
              message: getFailedActionMessage(result, 'Unable to add the cart item.'),
            };
            set(({ pendingAddOperations }) => ({
              pendingAddOperations: [...pendingAddOperations, operation],
              isSyncing: false,
              lastError: error,
              guestCartUpdatedAt: updatedAt,
            }));
            return { isSuccess: false, error };
          }

          return finishSuccess(result.data);
        },

        removeFromCart: async (item) => {
          if (!hasAuthenticatedUser())
            return finishGuestMutation((items) => removeCartItem(items, item));
          if (!item.cartEntryId)
            return finishError('The server cart entry id is required to remove this item.');

          set({ isSyncing: true, lastError: null });
          const result = await deleteCartItemAction({
            id: item.cartEntryId,
            idempotencyKey: crypto.randomUUID(),
          });
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

        emptyCart: async () => {
          if (!hasAuthenticatedUser()) {
            return finishGuestMutation(() => []);
          }

          set({ isSyncing: true, lastError: null });
          const result = await emptyCartAction({ idempotencyKey: crypto.randomUUID() });
          if (!isSuccessfulCartAction(result))
            return finishError(getFailedActionMessage(result, 'Unable to empty the cart.'));

          set({ items: [] });
          return finishSuccess(result.data);
        },

        setQuantity: async (item, quantity) => {
          if (!isNonNegativeInteger(quantity)) return finishError('Quantity cannot be negative.');
          if (quantity === 0) return get().removeFromCart(item);
          if (quantity === item.quantity) return finishSuccess(get().serverCart);

          if (quantity > item.quantity) {
            return get().addToCart(toCartItemInput(item), quantity - item.quantity);
          }

          if (hasAuthenticatedUser()) {
            if (!item.cartEntryId)
              return finishError('The server cart entry id is required to update this item.');

            set({ isSyncing: true, lastError: null });
            const deleteResult = await deleteCartItemAction({
              id: item.cartEntryId,
              idempotencyKey: crypto.randomUUID(),
            });
            if (!isSuccessfulCartAction(deleteResult))
              return finishError(
                getFailedActionMessage(deleteResult, 'Unable to update the cart item.'),
              );

            const addResult = await addCartItemAction(
              toAddPayload(toCartItemInput(item), quantity),
            );
            if (!isSuccessfulCartAction(addResult))
              return finishError(
                getFailedActionMessage(addResult, 'Unable to update the cart item.'),
              );

            set(({ items }) => ({ items: setItemQuantity(items, item, quantity) }));
            return finishSuccess(addResult.data);
          }

          return finishGuestMutation((items) => setItemQuantity(items, item, quantity));
        },

        hasProductWeight: (productId, weightId) =>
          get().items.some(
            (item) =>
              item.type === 'product' &&
              item.productId === productId &&
              getWeightId(item.weight) === weightId,
          ),

        hasPet: (petId) => get().items.some((item) => item.type === 'pet' && item.petId === petId),

        hydrateFromServer: (cart) =>
          set({
            serverCart: cart,
            items: createCartItemsFromServer(cart),
            lastError: null,
          }),

        syncLocalToServer: async () => {
          if (!hasAuthenticatedUser()) return finishError('Sign in before syncing the cart.');
          if (cartSyncPromise) return cartSyncPromise;

          cartSyncPromise = (async () => {
            const authenticatedUserId = getAuthenticatedUserId();
            const belongsToAnotherUser =
              get().cartUserId !== null && get().cartUserId !== authenticatedUserId;
            if (belongsToAnotherUser) {
              set({
                items: [],
                serverCart: null,
                needsServerSync: false,
                cartUserId: null,
                guestCartUpdatedAt: null,
                itemTombstones: {},
                pendingAddOperations: [],
              });
            }

            const latestServerCart = await getCartForSyncAction();
            if (!isSuccessfulCartAction(latestServerCart))
              return finishError(
                getFailedActionMessage(latestServerCart, 'Unable to load the cart.'),
              );

            const serverItems = createCartItemsFromServer(latestServerCart.data);
            const serverItemsByKey = new Map(serverItems.map((item) => [getItemKey(item), item]));
            const { guestCartUpdatedAt, itemTombstones, items: localItems } = get();
            const serverItemsToDelete: CartItem[] = [];
            const localItemsToAdd: CartItem[] = [];

            localItems.forEach((localItem) => {
              const serverItem = serverItemsByKey.get(getItemKey(localItem));
              // There is no competing server line to win this comparison. The cart-level
              // timestamp may change during login, so it must not discard a guest-only item.
              if (!serverItem) {
                localItemsToAdd.push(localItem);
                return;
              }
              const serverUpdatedAt = serverItem.updatedAt ?? latestServerCart.data.updatedAt;
              const localUpdatedAt = localItem.updatedAt ?? guestCartUpdatedAt;
              if (!isLocalCartNewer(localUpdatedAt, serverUpdatedAt)) return;

              if (serverItem.quantity !== localItem.quantity) {
                serverItemsToDelete.push(serverItem);
                localItemsToAdd.push(localItem);
              }
            });

            Object.entries(itemTombstones).forEach(([itemKey, deletedAt]) => {
              const serverItem = serverItemsByKey.get(itemKey);
              if (
                serverItem &&
                isLocalCartNewer(deletedAt, serverItem.updatedAt ?? latestServerCart.data.updatedAt)
              ) {
                serverItemsToDelete.push(serverItem);
              }
            });

            if (serverItemsToDelete.length === 0 && localItemsToAdd.length === 0) {
              return finishSuccess(latestServerCart.data);
            }

            set({ isSyncing: true, lastError: null, serverCart: latestServerCart.data });
            for (const serverItem of serverItemsToDelete) {
              if (!serverItem.cartEntryId)
                return finishError('The server cart entry id is required to sync the cart.');
              const result = await deleteCartItemAction({
                id: serverItem.cartEntryId,
                idempotencyKey: crypto.randomUUID(),
              });
              if (!isSuccessfulCartAction(result))
                return finishError(getFailedActionMessage(result, 'Unable to sync the cart.'));
            }

            for (const localItem of localItemsToAdd) {
              const operation =
                findPendingAddOperation(localItem, get().pendingAddOperations) ??
                createPendingAddOperation(toCartItemInput(localItem), localItem.quantity);
              set((state) => ({
                pendingAddOperations: state.pendingAddOperations.some(
                  (pendingOperation) =>
                    pendingOperation.idempotencyKey === operation.idempotencyKey,
                )
                  ? state.pendingAddOperations
                  : [...state.pendingAddOperations, operation],
              }));

              const result = await addCartItemAction(
                toAddPayload(operation.item, operation.quantity, operation.idempotencyKey),
              );
              if (!isSuccessfulCartAction(result))
                return finishError(getFailedActionMessage(result, 'Unable to sync the cart.'));
              set((state) => ({
                pendingAddOperations: state.pendingAddOperations.filter(
                  (pendingOperation) =>
                    pendingOperation.idempotencyKey !== operation.idempotencyKey,
                ),
              }));
            }

            const refreshedServerCart = await getCartForSyncAction();
            if (!isSuccessfulCartAction(refreshedServerCart))
              return finishError(
                getFailedActionMessage(
                  refreshedServerCart,
                  'Unable to load the synchronized cart.',
                ),
              );
            return finishSuccess(refreshedServerCart.data);
          })();

          try {
            return await cartSyncPromise;
          } finally {
            cartSyncPromise = null;
          }
        },

        replaceItems: (items) => set({ items, lastError: null }),
        clearCart: () =>
          set({
            items: [],
            serverCart: null,
            needsServerSync: false,
            cartUserId: null,
            guestCartUpdatedAt: null,
            itemTombstones: {},
            pendingAddOperations: [],
            lastError: null,
            isSyncing: false,
          }),
        clearError: () => set({ lastError: null }),
      };
    },
    {
      name: CART_STORAGE_KEY ?? 'cart',
      storage: createJSONStorage(() => localStorage),
      partialize: ({
        items,
        serverCart,
        needsServerSync,
        cartUserId,
        guestCartUpdatedAt,
        itemTombstones,
        pendingAddOperations,
      }) => ({
        items,
        serverCart,
        needsServerSync,
        cartUserId,
        guestCartUpdatedAt,
        itemTombstones,
        pendingAddOperations,
      }),
    },
  ),
);
