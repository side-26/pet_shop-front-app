import { beforeEach, describe, expect, it, vi } from 'vitest';

import { customFetcher } from '@/lib/api/customFetcher';

import {
  createPet,
  deletePet,
  disablePet,
  getCustomerPet,
  getCustomerPets,
  getCustomerPetsPage,
  getManagementPet,
  getManagementPets,
  getPetBaseInfo,
  getPetImages,
  getPetPrice,
  updatePetBaseInfo,
  updatePetImages,
  updatePetPrice,
} from './pets.service';

const {
  cacheLifeMock,
  invalidateDetailMock,
  invalidateListMock,
  registerDetailMock,
  registerListMock,
} = vi.hoisted(() => ({
  cacheLifeMock: vi.fn(),
  invalidateDetailMock: vi.fn(),
  invalidateListMock: vi.fn(),
  registerDetailMock: vi.fn(),
  registerListMock: vi.fn(),
}));

vi.mock('@/lib/api/customFetcher', () => ({ customFetcher: vi.fn() }));
vi.mock('@/utils/entityCache', () => ({
  EntityTag: vi.fn(function EntityTagMock(this: Record<string, unknown>) {
    this.cacheLife = cacheLifeMock;
    this.invalidateDetail = invalidateDetailMock;
    this.invalidateList = invalidateListMock;
    this.registerDetail = registerDetailMock;
    this.registerList = registerListMock;
    this.detail = (id: string) => `pets:detail:${id}`;
    this.list = 'pets:list';
  }),
}));

const fetcher = vi.mocked(customFetcher);
const id = '507f1f77bcf86cd799439010';
const petType = '507f1f77bcf86cd799439011';
const breed = '507f1f77bcf86cd799439012';
const mainImage = new File(['pet'], 'pet.webp', { type: 'image/webp' });
const success = { isSuccess: true as const, message: 'ok', data: {} as never };

describe('pet service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetcher.mockResolvedValue(success);
  });

  it('uses public cached customer list and detail contracts', async () => {
    await getCustomerPets({ title: 'kitten', petType });
    expect(fetcher).toHaveBeenNthCalledWith(1, {
      url: '/pets',
      method: 'GET',
      query: { title: 'kitten', petType, page: 1, limit: 10, sort: 'createdAt' },
      auth: false,
      cache: 'force-cache',
      next: { tags: ['pets:list'] },
    });
    expect(registerListMock).toHaveBeenCalledWith(
      `customer:limit=10&page=1&petType=${petType}&sort=createdAt&title=kitten`,
    );

    await getCustomerPet(id);
    expect(fetcher).toHaveBeenNthCalledWith(2, {
      url: `/pets/customer/${id}`,
      method: 'GET',
      auth: false,
      cache: 'force-cache',
      next: { tags: [`pets:detail:${id}`] },
    });
  });

  it('uses the full customer pagination endpoint with an inclusive price range', async () => {
    await getCustomerPetsPage({ title: 'budget', priceRange: '400-600' });
    expect(fetcher).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/pets/customer/paginate',
        query: { title: 'budget', priceRange: '400-600', page: 1, limit: 10, sort: 'createdAt' },
        auth: false,
      }),
    );
  });

  it('uses authenticated private management reads with deterministic defaults', async () => {
    await getManagementPets();
    expect(fetcher).toHaveBeenNthCalledWith(1, {
      url: '/pets/paginate',
      method: 'GET',
      query: { page: 1, limit: 10, sort: 'createdAt' },
      auth: true,
      cache: 'no-store',
    });
    expect(cacheLifeMock).toHaveBeenCalledWith({ stale: 600 });
    await getManagementPet(id);
    expect(fetcher).toHaveBeenNthCalledWith(2, {
      url: `/pets/manage/${id}`,
      method: 'GET',
      auth: true,
      cache: 'no-store',
    });
    expect(registerDetailMock).toHaveBeenCalledWith(id);
  });

  it('reads each authenticated management section', async () => {
    await getPetBaseInfo(id);
    await getPetImages(id);
    await getPetPrice(id);
    expect(fetcher.mock.calls.map(([options]) => options.url)).toEqual([
      `/pets/${id}/base-info`,
      `/pets/${id}/images`,
      `/pets/${id}/price`,
    ]);
  });

  it('serializes create and both update methods as multipart data', async () => {
    const input = {
      title: 'Kitten',
      description: 'Friendly',
      petType,
      breed,
      slug: 'kitten',
      images: {
        images: [mainImage, new File(['gallery'], 'gallery.webp', { type: 'image/webp' })],
        mainImageIndex: 0,
      },
      quantity: 2,
      price: 100,
      discountPercentage: 5,
      inEnable: true,
    };
    await createPet(input);
    const createBody = fetcher.mock.calls[0][0].body as FormData;
    expect(createBody.getAll('images')).toEqual([input.images.images[1]]);
    expect(createBody.get('mainImage')).toBe(mainImage);
    expect(createBody.get('quantity')).toBe('2');
    expect(invalidateListMock).toHaveBeenCalledOnce();

    await updatePetBaseInfo(id, { title: 'Updated' });
    const replacementMain = new File(['replacement'], 'replacement.webp', { type: 'image/webp' });
    await updatePetImages(id, {
      images: { images: [replacementMain], mainImageIndex: 0 },
    });
    await updatePetPrice(id, { price: 200 });
    expect(fetcher.mock.calls[1][0]).toMatchObject({
      url: `/pets/${id}`,
      method: 'PUT',
      body: { title: 'Updated' },
    });
    expect(fetcher.mock.calls[2][0]).toMatchObject({ url: `/pets/${id}/images`, method: 'PUT' });
    expect((fetcher.mock.calls[2][0].body as FormData).get('mainImage')).toBe(replacementMain);
    expect(fetcher.mock.calls[3][0]).toMatchObject({
      url: `/pets/${id}/price`,
      method: 'PUT',
      body: { price: 200 },
    });
    expect(invalidateDetailMock).toHaveBeenCalledWith(id);
  });

  it('uses status/delete endpoints and never invalidates failed mutations', async () => {
    fetcher.mockResolvedValue({
      isSuccess: false,
      message: 'failed',
      data: { messages: {}, details: {} },
    });
    await disablePet(id);
    await deletePet(id);
    expect(fetcher).toHaveBeenNthCalledWith(1, {
      url: `/pets/${id}/disable`,
      method: 'PATCH',
      body: undefined,
      auth: true,
      cache: 'no-store',
    });
    expect(fetcher).toHaveBeenNthCalledWith(2, {
      url: `/pets/${id}`,
      method: 'DELETE',
      auth: true,
      cache: 'no-store',
    });
    expect(invalidateListMock).not.toHaveBeenCalled();
    expect(invalidateDetailMock).not.toHaveBeenCalled();
  });
});
