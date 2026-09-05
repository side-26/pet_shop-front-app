import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { AuthSessionModel } from '@/_types';
import { USER_ROLES } from '@/configs/user-role';
import { getSession } from '@/utils/session';

import {
  createPetAction,
  deletePetAction,
  getCustomerPetsAction,
  getManagementPetsAction,
  getPetFormOptionsAction,
  updatePetPriceAction,
} from './pets.actions';
import * as service from './pets.service';
import { getAllPetTypes } from '@/entities/pet-types/pet-types.service';

vi.mock('@/utils/session', () => ({ getSession: vi.fn() }));
vi.mock('@/entities/pet-types/pet-types.service', () => ({ getAllPetTypes: vi.fn() }));
vi.mock('./pets.service', () => ({
  createPet: vi.fn(),
  deletePet: vi.fn(),
  disablePet: vi.fn(),
  enablePet: vi.fn(),
  getCustomerPet: vi.fn(),
  getCustomerPets: vi.fn(),
  getManagementPet: vi.fn(),
  getCustomerPetsPage: vi.fn(),
  getManagementPets: vi.fn(),
  getPetBaseInfo: vi.fn(),
  getPetImages: vi.fn(),
  getPetPrice: vi.fn(),
  updatePetBaseInfo: vi.fn(),
  updatePetImages: vi.fn(),
  updatePetPrice: vi.fn(),
}));

const id = '507f1f77bcf86cd799439010';
const petType = '507f1f77bcf86cd799439011';
const breed = '507f1f77bcf86cd799439012';
const description = { type: 'doc' as const, content: [] };
const mainImage = new File(['pet'], 'pet.webp', { type: 'image/webp' });
const success = { isSuccess: true as const, message: 'ok', data: {} as never };
const getSessionMock = vi.mocked(getSession);

function session(role: AuthSessionModel['role']): AuthSessionModel {
  return {
    accessExp: 1,
    accessToken: 'token',
    refreshToken: 'refresh',
    role,
    sessionExp: 2,
    userId: id,
  };
}

describe('pet actions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getSessionMock.mockResolvedValue(session(USER_ROLES.ADMIN));
  });

  it('allows public customer reads and validates their filters', async () => {
    vi.mocked(service.getCustomerPets).mockResolvedValue(success);
    await expect(getCustomerPetsAction({ title: ' kitten ', unknown: true })).resolves.toBe(
      success,
    );
    expect(getSessionMock).not.toHaveBeenCalled();
    expect(service.getCustomerPets).toHaveBeenCalledWith({
      title: 'kitten',
      page: 1,
      limit: 10,
      sort: 'createdAt',
    });
    await expect(getCustomerPetsAction({ page: 0 })).resolves.toMatchObject({ isSuccess: false });
  });

  it('allows sellers to read and mutate pets', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.SELLER));
    vi.mocked(service.getManagementPets).mockResolvedValue(success);
    vi.mocked(service.updatePetPrice).mockResolvedValue(success);
    await expect(getManagementPetsAction()).resolves.toBe(success);
    await expect(updatePetPriceAction({ id, price: 200 })).resolves.toBe(success);
    expect(service.updatePetPrice).toHaveBeenCalledWith(id, { price: 200 });
  });

  it('loads image-bearing pet-type select options before a pet type is selected', async () => {
    vi.mocked(getAllPetTypes).mockResolvedValue({
      isSuccess: true,
      message: null,
      data: [{ id: petType, title: 'گربه', mainImage: 'type.webp' }] as never,
    });
    await expect(getPetFormOptionsAction()).resolves.toMatchObject({
      isSuccess: true,
      data: {
        petTypes: [{ id: petType, title: 'گربه', image: 'type.webp' }],
      },
    });
  });

  it('validates normalized create input before calling the service', async () => {
    vi.mocked(service.createPet).mockResolvedValue(success);
    await expect(
      createPetAction({
        title: ' Kitten ',
        description,
        petType,
        breed,
        images: { images: [mainImage], mainImageIndex: 0 },
      }),
    ).resolves.toBe(success);
    expect(service.createPet).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Kitten',
        description,
        images: { images: [mainImage], mainImageIndex: 0 },
        quantity: 0,
        price: 1000,
        discountPercentage: 0,
        inEnable: true,
        slug: 'kitten',
      }),
    );
  });

  it('rejects customers from management and restricts deletion to admins', async () => {
    getSessionMock.mockResolvedValue(session(USER_ROLES.CUSTOMER));
    await expect(getManagementPetsAction()).resolves.toMatchObject({ isSuccess: false });
    expect(service.getManagementPets).not.toHaveBeenCalled();

    getSessionMock.mockResolvedValue(session(USER_ROLES.SELLER));
    await expect(deletePetAction({ id })).resolves.toMatchObject({
      isSuccess: false,
      message: 'شما اجازه حذف حیوانات را ندارید.',
    });
    expect(service.deletePet).not.toHaveBeenCalled();
  });
});
