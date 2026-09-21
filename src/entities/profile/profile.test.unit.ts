import { describe, expect, it } from 'vitest';

import {
  createProfileAddressSchema,
  getProfileOrdersSchema,
  resetProfilePasswordSchema,
  updateProfileAddressSchema,
} from './profile.schema';

const address = {
  province: 'تهران',
  city: 'تهران',
  detailAddress: 'خیابان آزادی پلاک دوازده',
  plate: '۱۲',
  postalCode: '1234567890',
  receiverIsMe: false,
  firstName: 'علی',
  lastName: 'احمدی',
  nationalCode: '0012345678',
  phoneNumber: '09121234567',
};

describe('profile schemas', () => {
  it('validates password reset confirmation', async () => {
    const input = {
      oldPassword: 'old-password',
      password: 'new-password',
      repeatPassword: 'new-password',
    };

    await expect(resetProfilePasswordSchema.validate(input)).resolves.toEqual(input);
    await expect(
      resetProfilePasswordSchema.validate({ ...input, repeatPassword: 'different-password' }),
    ).rejects.toThrow();
  });

  it('requires receiver identity for an address belonging to another person', async () => {
    await expect(createProfileAddressSchema.validate(address)).resolves.toMatchObject(address);
    await expect(
      createProfileAddressSchema.validate({
        ...address,
        firstName: undefined,
        lastName: undefined,
        nationalCode: undefined,
        phoneNumber: undefined,
      }),
    ).rejects.toThrow();
  });

  it('accepts a partial address update and normalizes order defaults', async () => {
    await expect(updateProfileAddressSchema.validate({ plate: '۲۵' })).resolves.toEqual({
      plate: '۲۵',
    });
    await expect(getProfileOrdersSchema.validate({})).resolves.toEqual({
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
  });
});
