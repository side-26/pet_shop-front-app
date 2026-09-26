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
  latLng: [35.7219, 51.3347],
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

  it('does not validate or retain receiver identity when the receiver is the current user', async () => {
    await expect(
      createProfileAddressSchema.validate({
        ...address,
        receiverIsMe: true,
        firstName: 'نا',
        lastName: '',
        nationalCode: 'invalid',
        phoneNumber: 'invalid',
      }),
    ).resolves.toEqual(
      expect.not.objectContaining({
        firstName: expect.anything(),
        lastName: expect.anything(),
        nationalCode: expect.anything(),
        phoneNumber: expect.anything(),
      }),
    );
  });

  it('uses the Persian postal-code field label in validation messages', async () => {
    await expect(
      createProfileAddressSchema.validate({ ...address, postalCode: '123' }),
    ).rejects.toThrow('کد پستی');
  });

  it.each([
    { latLng: [35.7219] },
    { latLng: [35.7219, '51.3347'] },
    { latLng: [35.7219, 51.3347, 1] },
  ])('rejects an invalid coordinate pair %#', async ({ latLng }) => {
    await expect(createProfileAddressSchema.validate({ ...address, latLng })).rejects.toThrow();
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
