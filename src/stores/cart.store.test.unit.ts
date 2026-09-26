import { afterEach, describe, expect, it, vi } from 'vitest';

import { useAuthStore } from '@/entities/auth/auth.store';
import type { CartDTO } from '@/entities/users/users.dto';

import { useCartStore, type CartItemInput } from './cart.store';

const addCartItemActionMock = vi.hoisted(() => vi.fn());
const deleteCartItemActionMock = vi.hoisted(() => vi.fn());

vi.mock('@/entities/users/users.actions', () => ({
  addCartItemAction: addCartItemActionMock,
  deleteCartItemAction: deleteCartItemActionMock,
}));

const product: CartItemInput = {
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

function resetStore() {
  useAuthStore.getState().deleteUserIdentity();
  useCartStore.setState({
    items: [],
    serverCart: null,
    needsServerSync: false,
    isSyncing: false,
    lastError: null,
  });
  useCartStore.persist.clearStorage();
}

afterEach(() => {
  resetStore();
  vi.clearAllMocks();
});

describe('useCartStore', () => {
  it('persists and combines matching guest product and weight entries locally', async () => {
    await useCartStore.getState().addToCart(product, 1);
    await useCartStore.getState().addToCart(product, 2);

    expect(useCartStore.getState()).toMatchObject({
      items: [{ productId: product.productId, quantity: 3, weight: product.weight }],
      needsServerSync: true,
    });
    expect(addCartItemActionMock).not.toHaveBeenCalled();
  });

  it('uses the server action and keeps its returned cart for an authenticated add', async () => {
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    addCartItemActionMock.mockResolvedValue({ isSuccess: true, message: null, data: cart });

    await expect(useCartStore.getState().addToCart(product)).resolves.toEqual({
      isSuccess: true,
      cart,
    });

    expect(addCartItemActionMock).toHaveBeenCalledWith({
      itemId: product.productId,
      itemType: 'product',
      weightId: product.weight._id,
      quantity: 1,
    });
    expect(useCartStore.getState().serverCart).toEqual(cart);
    expect(useCartStore.getState().needsServerSync).toBe(false);
  });

  it('removes the final guest item when decreasing its quantity', async () => {
    await useCartStore.getState().addToCart(product);
    const item = useCartStore.getState().items[0];
    if (!item) throw new Error('Expected a cart item.');

    await useCartStore.getState().decreaseQuantity(item);

    expect(useCartStore.getState().items).toEqual([]);
  });
});
