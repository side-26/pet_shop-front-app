import { describe, expect, it } from 'vitest';

import { usersApiPaths } from './users.api-paths';

describe('usersApiPaths', () => {
  it('owns the backend checkout route and dynamic users-entity paths', () => {
    expect(usersApiPaths.cart.checkout).toBe('/cart/checkout');
    expect(usersApiPaths.cart.deleteById('cart-entry-1')).toBe('/cart/delete/cart-entry-1');
    expect(usersApiPaths.addressById('address-1')).toBe('/users/addresses/address-1');
    expect(usersApiPaths.userStatus('disable', 'user-1')).toBe('/users/disable/user-1');
  });
});
