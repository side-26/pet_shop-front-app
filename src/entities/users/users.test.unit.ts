import { describe, expect, it } from 'vitest';

import { createUsersListCacheKey } from './users.helpers';
import { createUserSchema, getAllPaginatedUsersSchema } from './users.schema';

describe('getAllPaginatedUsersSchema', () => {
  it('applies the documented pagination and enabled defaults', async () => {
    await expect(getAllPaginatedUsersSchema.validate({})).resolves.toEqual({
      page: 1,
      limit: 20,
      isEnable: true,
    });
  });

  it('accepts documented filters and sort values', async () => {
    const input = {
      fullName: '  Ali Rezaei  ',
      role: 'admin',
      phoneNumber: '09123456789',
      nationalCode: '0012345678',
      page: 2,
      limit: 50,
      isEnable: false,
      sort: 'dsc',
    } as const;

    await expect(getAllPaginatedUsersSchema.validate(input)).resolves.toEqual({
      ...input,
      fullName: 'Ali Rezaei',
    });
  });

  it.each([{ page: 0 }, { limit: 0 }, { sort: 'desc' }, { role: 'owner' }])(
    'rejects invalid query input %#',
    async (input) => {
      await expect(getAllPaginatedUsersSchema.validate(input)).rejects.toThrow();
    },
  );
});

describe('createUserSchema', () => {
  const validInput = {
    phoneNumber: '09123456789',
    password: 'password123',
    confirmPassword: 'password123',
    role: 'customer',
  } as const;

  it('accepts every supported user role', async () => {
    for (const role of ['admin', 'seller', 'customer'] as const) {
      await expect(createUserSchema.validate({ ...validInput, role })).resolves.toEqual({
        ...validInput,
        role,
      });
    }
  });

  it.each(['phoneNumber', 'password', 'confirmPassword', 'role'] as const)(
    'requires %s',
    async (field) => {
      const input: Record<string, unknown> = { ...validInput };
      delete input[field];

      await expect(createUserSchema.validate(input)).rejects.toThrow();
    },
  );

  it.each([
    { ...validInput, phoneNumber: '123' },
    { ...validInput, password: 'short', confirmPassword: 'short' },
    { ...validInput, confirmPassword: 'different-password' },
    { ...validInput, role: 'owner' },
  ])('rejects invalid create-user input %#', async (input) => {
    await expect(createUserSchema.validate(input)).rejects.toThrow();
  });
});

describe('createUsersListCacheKey', () => {
  it('creates the same deterministic key regardless of object property order', () => {
    const first = { page: 2, limit: 20, isEnable: true, role: 'admin' as const };
    const second = { role: 'admin' as const, isEnable: true, limit: 20, page: 2 };

    expect(createUsersListCacheKey(first)).toBe(createUsersListCacheKey(second));
  });
});
