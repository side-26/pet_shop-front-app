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
    useAuthStore.getState().saveUserIdentity({ userId: 'user-1' } as never);
    addCartItemActionMock.mockResolvedValue({ isSuccess: true, message: null, data: cart });

    await expect(useCartStore.getState().addToCart(product)).resolves.toEqual({
      isSuccess: true,
      cart,
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
    expect(useCartStore.getState().serverCart).toEqual(cart);
    expect(useCartStore.getState().needsServerSync).toBe(false);
    expect(useCartStore.getState().hasProductWeight(product.productId, product.weight._id!)).toBe(
      true,
    );
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
    const cartItem = { ...product, quantity: 2, cartEntryId: 'cart-entry-1' } as const;
    const cartAfterUpdate: CartDTO = {
      ...cart,
      items: [
        {
          _id: 'cart-entry-2',
          item: product.productId,
          itemType: 'product',
          weight: product.weight._id,
          quantity: 1,
        },
      ],
    };
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

    expect(deleteCartItemActionMock).toHaveBeenCalledWith({ id: 'cart-entry-1' });
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
      cartEntryId: 'cart-entry-2',
    });
  });

  it('finds pets by pet ID', async () => {
    expect(useCartStore.getState().hasPet(pet.petId)).toBe(false);

    await useCartStore.getState().addToCart(pet);

    expect(useCartStore.getState().hasPet(pet.petId)).toBe(true);
    expect(useCartStore.getState().hasPet('another-pet')).toBe(false);
  });
});
