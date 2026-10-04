/**
 * Backend routes owned by the users entity. Keep these aligned with the
 * backend `src/entities/users/route.path.js` contract.
 */
export const usersApiPaths = {
  users: '/users',
  currentUser: '/users/current',
  usersList: '/users/all',
  usersPaginate: '/users/paginate',
  userById: (id: string) => `/users/${id}`,
  userProfile: '/users/edit-info',
  userPassword: '/users/change-password',
  userStatus: (status: 'enable' | 'disable', id: string) => `/users/${status}/${id}`,
  addresses: '/users/addresses',
  addressById: (addressId: string) => `/users/addresses/${addressId}`,
  cart: {
    add: '/cart/add',
    all: '/cart/all',
    checkout: '/cart/checkout',
    items: '/cart/items',
    deleteById: (id: string) => `/cart/delete/${id}`,
    empty: '/cart/empty',
    deliveryWindows: '/cart/delivery-windows',
    deliveryWindow: '/cart/delivery-window',
  },
  wishlist: {
    add: '/wishlist/add',
    all: '/wishlist/all',
    deleteById: (id: string) => `/wishlist/delete/${id}`,
  },
} as const;
