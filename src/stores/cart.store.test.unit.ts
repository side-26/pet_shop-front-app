import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/entities/auth/auth.store';
import type { CartDTO } from '@/entities/users/users.dto';

import { useCartStore, type CartItemInput } from './cart.store';

const addCartItemActionMock = vi.hoisted(() => vi.fn());
const deleteCartItemActionMock = vi.hoisted(() => vi.fn());
const emptyCartActionMock = vi.hoisted(() => vi.fn());
const getCartForSyncActionMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/users/users.actions', () => ({
  addCartItemAction: addCartItemActionMock,
  deleteCartItemAction: deleteCartItemActionMock,
  emptyCartAction: emptyCartActionMock,
  getCartForSyncAction: getCartForSyncActionMock,
}));

const product: Extract<CartItemInput, { type: 'product' }> = {
  type: 'product',
  productId: '507f1f77bcf86cd799439011',
  weight: {
    _id: '507f1f77bcf86cd799439012',
    metric: 'KG',
    value: 1,
    quantity: 10,
    price: 100_000,
    discountPercentage: 0,
  },
};

const pet: CartItemInput = {
  type: 'pet',
  petId: '507f1f77bcf86cd799439013',
};

const cart: CartDTO = {
  totalPrice: 100_000,
  items: [],
  discountPrice: 0,
  userAddress: null,
  deliveringDateToShipping: null,
  shippingPrice: 0,
  shippingInfo: { name: '', trackingCode: '', estimateDeliveryDate: null },
  paymentType: 0,
  instalmentCompany: null,
};

function createProductCart(quantity: number, cartEntryId = 'cart-entry-1'): CartDTO {
  return {
    ...cart,
    items: [
      {
        _id: cartEntryId,
        itemType: 'product',
        quantity,
        weight: product.weight._id,
        item: {
          _id: product.productId,
          title: 'غذای خشک سگ',
          mainImage: '/product.jpg',
          price: 100_000,
          discountPercentage: 0,
          weights: [product.weight],
        },
      },
    ],
  };
}

function resetStore() {
  useAuthStore.getState().deleteUserIdentity();
  useCartStore.setState({
    items: [],
    serverCart: null,
    needsServerSync: false,
    cartUserId: null,
    guestCartUpdatedAt: null,
    itemTombstones: {},
    pendingAddOperations: [],
    isSyncing: false,
    lastError: null,
  });
  useCartStore.persist.clearStorage();
}

afterEach(() => {
  resetStore();
  vi.clearAllMocks();
});

beforeEach(() => {
  getCartForSyncActionMock.mockResolvedValue({ isSuccess: true, message: null, data: cart });
});

describe('useCartStore', () => {
  it('persists and combines matching guest product and weight entries locally', async () => {
    expect(useCartStore.getState().hasProductWeight(product.productId, product.weight._id!)).toBe(
      false,
    );

    await useCartStore.getState().addToCart(product, 1);
    await useCartStore.getState().addToCart(product, 2);

    expect(useCartStore.getState()).toMatchObject({
      items: [{ productId: product.productId, quantity: 3, weight: product.weight }],
      needsServerSync: true,
    });
    expect(useCartStore.getState().hasProductWeight(product.productId, product.weight._id!)).toBe(
      true,
    );
    expect(useCartStore.getState().hasProductWeight(product.productId, 'another-weight')).toBe(
      false,
    );
    expect(addCartItemActionMock).not.toHaveBeenCalled();
  });

  it('uses the server action and keeps its returned cart for an authenticated add', async () => {
    const updatedCart = createProductCart(1);
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    addCartItemActionMock.mockResolvedValue({ isSuccess: true, message: null, data: updatedCart });

    await expect(useCartStore.getState().addToCart(product)).resolves.toEqual({
      isSuccess: true,
      cart: updatedCart,
    });

    expect(addCartItemActionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: product.productId,
        itemType: 'product',
        weightId: product.weight._id,
        quantity: 1,
        idempotencyKey: expect.any(String),
      }),
    );
    expect(useCartStore.getState().serverCart).toEqual(updatedCart);
    expect(useCartStore.getState().needsServerSync).toBe(false);
    expect(useCartStore.getState().hasProductWeight(product.productId, product.weight._id!)).toBe(
      true,
    );
  });

  it('persists a failed authenticated add and retries it with the same idempotency key', async () => {
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    addCartItemActionMock
      .mockResolvedValueOnce({ isSuccess: false, message: 'ارتباط با سرور برقرار نشد.' })
      .mockResolvedValueOnce({ isSuccess: true, message: null, data: cart });

    await expect(useCartStore.getState().addToCart(product)).resolves.toMatchObject({
      isSuccess: false,
    });

    const [firstPayload] = addCartItemActionMock.mock.calls[0];
    expect(useCartStore.getState().items).toMatchObject([
      { productId: product.productId, quantity: 1, weight: product.weight },
    ]);
    expect(useCartStore.getState().pendingAddOperations).toHaveLength(1);
    expect(firstPayload).toMatchObject({
      itemId: product.productId,
      idempotencyKey: expect.any(String),
    });

    await expect(useCartStore.getState().syncLocalToServer()).resolves.toEqual({
      isSuccess: true,
      cart,
    });

    expect(addCartItemActionMock).toHaveBeenLastCalledWith(firstPayload);
    expect(useCartStore.getState().pendingAddOperations).toEqual([]);
  });

  it('shares one in-flight guest-cart synchronization between concurrent callers', async () => {
    await useCartStore.getState().addToCart(product);
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);

    let resolveAdd: ((value: unknown) => void) | undefined;
    addCartItemActionMock.mockImplementationOnce(
      () => new Promise((resolve) => (resolveAdd = resolve)),
    );

    const firstSync = useCartStore.getState().syncLocalToServer();
    const secondSync = useCartStore.getState().syncLocalToServer();

    await Promise.resolve();
    await Promise.resolve();
    expect(addCartItemActionMock).toHaveBeenCalledOnce();
    resolveAdd?.({ isSuccess: true, message: null, data: cart });

    await expect(Promise.all([firstSync, secondSync])).resolves.toEqual([
      { isSuccess: true, cart },
      { isSuccess: true, cart },
    ]);
  });

  it('merges legacy local cart items after sign-in even when their sync flag is missing', async () => {
    useCartStore.setState({
      items: [{ ...product, quantity: 2 }],
      needsServerSync: false,
      cartUserId: null,
      guestCartUpdatedAt: '2026-10-04T00:00:00.000Z',
    });
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    addCartItemActionMock.mockResolvedValue({ isSuccess: true, message: null, data: cart });

    await expect(useCartStore.getState().syncLocalToServer()).resolves.toEqual({
      isSuccess: true,
      cart,
    });

    expect(getCartForSyncActionMock).toHaveBeenCalledTimes(2);
    expect(addCartItemActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: product.productId, quantity: 2 }),
    );
    expect(useCartStore.getState()).toMatchObject({
      cartUserId: 'user-1',
      guestCartUpdatedAt: null,
      needsServerSync: false,
    });
  });

  it('syncs a guest-only item even when login made the empty server cart newer', async () => {
    const serverCartAfterLogin = { ...cart, updatedAt: '2026-10-05T00:00:00.000Z' };
    const syncedCart = createProductCart(2, 'cart-entry-server');
    useCartStore.setState({
      items: [{ ...product, quantity: 2, updatedAt: '2026-10-04T00:00:00.000Z' }],
      needsServerSync: true,
      cartUserId: null,
      guestCartUpdatedAt: '2026-10-04T00:00:00.000Z',
    });
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    getCartForSyncActionMock
      .mockResolvedValueOnce({ isSuccess: true, message: null, data: serverCartAfterLogin })
      .mockResolvedValueOnce({ isSuccess: true, message: null, data: syncedCart });
    addCartItemActionMock.mockResolvedValue({ isSuccess: true, message: null, data: syncedCart });

    await expect(useCartStore.getState().syncLocalToServer()).resolves.toEqual({
      isSuccess: true,
      cart: syncedCart,
    });

    expect(addCartItemActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: product.productId, quantity: 2 }),
    );
  });

  it('does not merge a persisted cart that belongs to a different signed-in user', async () => {
    useCartStore.setState({
      items: [{ ...product, quantity: 2 }],
      needsServerSync: true,
      cartUserId: 'user-1',
      pendingAddOperations: [
        {
          item: product,
          quantity: 2,
          idempotencyKey: 'user-1-pending-cart-add',
        },
      ],
    });
    useAuthStore.getState().saveUserIdentity({ userId: 'user-2' } as never);

    await expect(useCartStore.getState().syncLocalToServer()).resolves.toEqual({
      isSuccess: true,
      cart,
    });

    expect(addCartItemActionMock).not.toHaveBeenCalled();
    expect(useCartStore.getState()).toMatchObject({
      items: [],
      cartUserId: 'user-2',
      pendingAddOperations: [],
    });
  });

  it('hydrates local cart items from a populated server cart during an authenticated refresh', async () => {
    const refreshedCart = createProductCart(3, 'cart-entry-server');
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    useCartStore.setState({ cartUserId: 'user-1' });
    getCartForSyncActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: refreshedCart,
    });

    await expect(useCartStore.getState().syncLocalToServer()).resolves.toEqual({
      isSuccess: true,
      cart: refreshedCart,
    });

    expect(useCartStore.getState().items).toEqual([
      expect.objectContaining({
        type: 'product',
        productId: product.productId,
        cartEntryId: 'cart-entry-server',
        quantity: 3,
      }),
    ]);
  });

  it('replaces an older server cart with the newer local snapshot', async () => {
    const olderServerItems = createProductCart(3, 'server-cart-entry').items.map((item) => ({
      ...item,
      updatedAt: '2026-10-03T00:00:00.000Z',
    }));
    const olderServerCart = {
      ...createProductCart(3, 'server-cart-entry'),
      items: olderServerItems,
      updatedAt: '2026-10-05T00:00:00.000Z',
    };
    const emptiedCart = { ...cart, updatedAt: '2026-10-05T00:00:00.000Z' };
    const syncedCart = createProductCart(2, 'local-cart-entry');
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    useCartStore.setState({
      items: [{ ...product, quantity: 2 }],
      needsServerSync: true,
      cartUserId: null,
      guestCartUpdatedAt: '2026-10-04T00:00:00.000Z',
    });
    getCartForSyncActionMock
      .mockResolvedValueOnce({ isSuccess: true, message: null, data: olderServerCart })
      .mockResolvedValueOnce({ isSuccess: true, message: null, data: syncedCart });
    deleteCartItemActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: emptiedCart,
    });
    addCartItemActionMock.mockResolvedValue({ isSuccess: true, message: null, data: syncedCart });

    await expect(useCartStore.getState().syncLocalToServer()).resolves.toEqual({
      isSuccess: true,
      cart: syncedCart,
    });

    expect(deleteCartItemActionMock).toHaveBeenCalledWith({
      id: 'server-cart-entry',
      idempotencyKey: expect.any(String),
    });
    expect(addCartItemActionMock).toHaveBeenCalledWith(
      expect.objectContaining({ itemId: product.productId, quantity: 2 }),
    );
    expect(useCartStore.getState().items).toEqual([
      expect.objectContaining({ productId: product.productId, quantity: 2 }),
    ]);
  });

  it('replaces an older local cart with the newer server snapshot', async () => {
    const newerServerItems = createProductCart(3, 'server-cart-entry').items.map((item) => ({
      ...item,
      updatedAt: '2026-10-05T00:00:00.000Z',
    }));
    const newerServerCart = {
      ...createProductCart(3, 'server-cart-entry'),
      items: newerServerItems,
      updatedAt: '2026-10-03T00:00:00.000Z',
    };
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    useCartStore.setState({
      items: [{ ...product, quantity: 2 }],
      needsServerSync: true,
      cartUserId: null,
      guestCartUpdatedAt: '2026-10-04T00:00:00.000Z',
      pendingAddOperations: [
        { item: product, quantity: 2, idempotencyKey: 'stale-local-cart-add' },
      ],
    });
    getCartForSyncActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: newerServerCart,
    });

    await expect(useCartStore.getState().syncLocalToServer()).resolves.toEqual({
      isSuccess: true,
      cart: newerServerCart,
    });

    expect(emptyCartActionMock).not.toHaveBeenCalled();
    expect(addCartItemActionMock).not.toHaveBeenCalled();
    expect(useCartStore.getState()).toMatchObject({
      items: [expect.objectContaining({ productId: product.productId, quantity: 3 })],
      guestCartUpdatedAt: null,
      needsServerSync: false,
      pendingAddOperations: [],
    });
  });

  it('keeps a newer local removal from being resurrected by an older server line', async () => {
    const olderServerCart = {
      ...createProductCart(1, 'server-cart-entry'),
      items: createProductCart(1, 'server-cart-entry').items.map((item) => ({
        ...item,
        updatedAt: '2026-10-03T00:00:00.000Z',
      })),
      updatedAt: '2026-10-05T00:00:00.000Z',
    };
    const emptyServerCart = { ...cart, updatedAt: '2026-10-06T00:00:00.000Z' };
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    useCartStore.setState({
      items: [],
      needsServerSync: true,
      cartUserId: null,
      guestCartUpdatedAt: '2026-10-04T00:00:00.000Z',
      itemTombstones: {
        [`product:${product.productId}:${product.weight._id}`]: '2026-10-04T00:00:00.000Z',
      },
    });
    getCartForSyncActionMock
      .mockResolvedValueOnce({ isSuccess: true, message: null, data: olderServerCart })
      .mockResolvedValueOnce({ isSuccess: true, message: null, data: emptyServerCart });
    deleteCartItemActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: emptyServerCart,
    });

    await expect(useCartStore.getState().syncLocalToServer()).resolves.toEqual({
      isSuccess: true,
      cart: emptyServerCart,
    });

    expect(deleteCartItemActionMock).toHaveBeenCalledWith({
      id: 'server-cart-entry',
      idempotencyKey: expect.any(String),
    });
    expect(useCartStore.getState().itemTombstones).toEqual({});
  });

  it('removes the final guest item when decreasing its quantity', async () => {
    await useCartStore.getState().addToCart(product);
    const item = useCartStore.getState().items[0];
    if (!item) throw new Error('Expected a cart item.');

    await useCartStore.getState().decreaseQuantity(item);

    expect(useCartStore.getState().items).toEqual([]);
  });

  it('replaces an authenticated cart entry when decreasing its quantity', async () => {
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    const cartItem = {
      ...product,
      quantity: 2,
      cartEntryId: '507f1f77bcf86cd799439014',
    } as const;
    const cartAfterUpdate = createProductCart(1, '507f1f77bcf86cd799439015');
    deleteCartItemActionMock.mockResolvedValue({ isSuccess: true, message: null, data: cart });
    addCartItemActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: cartAfterUpdate,
    });
    useCartStore.setState({ items: [cartItem] });

    await expect(useCartStore.getState().setQuantity(cartItem, 1)).resolves.toMatchObject({
      isSuccess: true,
    });

    expect(deleteCartItemActionMock).toHaveBeenCalledWith({
      id: '507f1f77bcf86cd799439014',
      idempotencyKey: expect.any(String),
    });
    expect(addCartItemActionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: product.productId,
        itemType: 'product',
        weightId: product.weight._id,
        quantity: 1,
        idempotencyKey: expect.any(String),
      }),
    );
    expect(useCartStore.getState().items[0]).toMatchObject({
      quantity: 1,
      cartEntryId: '507f1f77bcf86cd799439015',
    });
  });

  it('finds pets by pet ID', async () => {
    expect(useCartStore.getState().hasPet(pet.petId)).toBe(false);

    await useCartStore.getState().addToCart(pet);

    expect(useCartStore.getState().hasPet(pet.petId)).toBe(true);
    expect(useCartStore.getState().hasPet('another-pet')).toBe(false);
  });
});
