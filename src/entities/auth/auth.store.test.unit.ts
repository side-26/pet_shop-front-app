import { afterEach, describe, expect, it } from 'vitest';

import { useAuthStore } from './auth.store';

const initialIdentity = {
  userId: 'user-1',
  firstName: 'نیلوفر',
  lastName: 'احمدی',
  phoneNumber: '09121234567',
  role: 'customer',
  avatar: '',
  email: 'niloofar@example.com',
  nationalCode: '0012345678',
  age: 31,
  birthDate: null,
} as const;

afterEach(() => {
  useAuthStore.getState().deleteUserIdentity();
});

describe('useAuthStore userIdentity slice', () => {
  it('starts without a user identity and saves one', () => {
    expect(useAuthStore.getState().userIdentity).toBeNull();

    useAuthStore.getState().saveUserIdentity(initialIdentity);

    expect(useAuthStore.getState().userIdentity).toEqual(initialIdentity);
  });

  it('updates the saved user identity', () => {
    useAuthStore.getState().saveUserIdentity(initialIdentity);
    const updatedIdentity = { ...initialIdentity, firstName: 'آرین', avatar: 'avatar.webp' };

    useAuthStore.getState().updateUserIdentity(updatedIdentity);

    expect(useAuthStore.getState().userIdentity).toEqual(updatedIdentity);
  });

  it('deletes the saved user identity by resetting it to null', () => {
    useAuthStore.getState().saveUserIdentity(initialIdentity);

    useAuthStore.getState().deleteUserIdentity();

    expect(useAuthStore.getState().userIdentity).toBeNull();
  });
});
