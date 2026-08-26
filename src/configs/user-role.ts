export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  SELLER: 'seller',
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
