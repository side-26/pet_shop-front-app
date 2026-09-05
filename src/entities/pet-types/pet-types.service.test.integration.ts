import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import { updatePetType } from './pet-types.service';

const { invalidateDetailMock, invalidateListMock } = vi.hoisted(() => ({
  invalidateDetailMock: vi.fn(),
  invalidateListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
  }),
}));

const id = '507f1f77bcf86cd799439011';
const description = { type: 'doc' as const, content: [] };
const petType = {
  id,
  title: 'سگ',
  description,
  mainImage: 'https://cdn.example.test/pet-types/dog.webp',
  thumbnail: 'https://cdn.example.test/pet-types/dog-thumb.webp',
  isEnabled: true,
  propertyDefinitions: [],
  slug: 'dog',
  createdAt: '2026-08-31T00:00:00.000Z',
  updatedAt: '2026-08-31T00:00:00.000Z',
};

describe('pet-type service image updates', () => {
  beforeEach(() => vi.clearAllMocks());

  it('omits mainImage when a stored image remains unchanged', async () => {
    vi.mocked(customFetcher).mockResolvedValue({
      isSuccess: true,
      message: 'updated',
      data: petType,
    });

    await updatePetType(id, { title: petType.title, description: petType.description });

    const options = vi.mocked(customFetcher).mock.calls[0]?.[0];
    expect(options).toMatchObject({
      url: `/pet-types/${id}`,
      method: 'PUT',
      auth: true,
      cache: 'no-store',
    });
    expect(Object.fromEntries((options?.body as FormData).entries())).toEqual({
      title: petType.title,
      description: JSON.stringify(petType.description),
    });
    expect(invalidateListMock).toHaveBeenCalledOnce();
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
  });
});
