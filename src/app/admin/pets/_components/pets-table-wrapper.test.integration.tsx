import { describe, expect, it, vi } from 'vitest';

import { getManagementPetsAction } from '@/entities/pets/pets.actions';

import { PetsTableWrapper } from './pets-table-wrapper';

vi.mock('@/entities/pets/pets.actions', () => ({
  getManagementPetsAction: vi.fn(() => new Promise(() => undefined)),
}));

describe('PetsTableWrapper', () => {
  it('starts the request with all inputs and derives a deterministic Suspense key', () => {
    const query = { title: 'پرشین', page: '2', limit: '20', isEnable: 'true' };
    const boundary = PetsTableWrapper({ page: 2, query });
    expect(vi.mocked(getManagementPetsAction)).toHaveBeenCalledWith(query);
    expect(boundary.key).toBe(JSON.stringify(query));
  });
});
