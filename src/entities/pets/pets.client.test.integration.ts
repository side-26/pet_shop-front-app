import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createPetAction,
  deletePetAction,
  disablePetAction,
  updatePetPriceAction,
} from './pets.actions';
import {
  submitCreatePet,
  submitDeletePet,
  submitPetEnabledUpdate,
  submitUpdatePetPrice,
} from './pets.client';

vi.mock('./pets.actions', () => ({
  createPetAction: vi.fn(),
  deletePetAction: vi.fn(),
  disablePetAction: vi.fn(),
  enablePetAction: vi.fn(),
  updatePetBaseInfoAction: vi.fn(),
  updatePetImagesAction: vi.fn(),
  updatePetPriceAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439010';
const input = {
  title: 'Kitten',
  description: 'Friendly',
  petType: '507f1f77bcf86cd799439011',
  breed: '507f1f77bcf86cd799439012',
  slug: 'kitten',
  images: {
    images: [new File(['pet'], 'pet.webp', { type: 'image/webp' })],
    mainImageIndex: 0,
  },
  quantity: 0,
  price: 0,
  discountPercentage: 0,
  inEnable: true,
};
const failure = {
  isSuccess: false as const,
  message: 'failed',
  data: { messages: {}, details: {} },
};

describe('pet client orchestration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('shows success messages for create and update', async () => {
    vi.mocked(createPetAction).mockResolvedValue({
      isSuccess: true,
      message: 'created',
      data: {} as never,
    });
    vi.mocked(updatePetPriceAction).mockResolvedValue({
      isSuccess: true,
      message: 'updated',
      data: {} as never,
    });
    await expect(submitCreatePet(input, vi.fn())).resolves.toBe(true);
    await expect(submitUpdatePetPrice(id, { price: 200 }, vi.fn())).resolves.toBe(true);
    expect(updatePetPriceAction).toHaveBeenCalledWith({ id, price: 200 });
    expect(toast.add).toHaveBeenNthCalledWith(1, { type: 'success', title: 'created' });
    expect(toast.add).toHaveBeenNthCalledWith(2, { type: 'success', title: 'updated' });
  });

  it('forwards complete form and row errors', async () => {
    const setError = vi.fn();
    vi.mocked(createPetAction).mockResolvedValue(failure);
    vi.mocked(disablePetAction).mockResolvedValue(failure);
    vi.mocked(deletePetAction).mockResolvedValue(failure);
    await expect(submitCreatePet(input, setError)).resolves.toBe(false);
    await expect(submitPetEnabledUpdate(id, false)).resolves.toBe(false);
    await expect(submitDeletePet(id)).resolves.toBe(false);
    expect(globalErrorHandler).toHaveBeenNthCalledWith(1, failure, { showErrorFields: setError });
    expect(globalErrorHandler).toHaveBeenNthCalledWith(2, failure);
    expect(globalErrorHandler).toHaveBeenNthCalledWith(3, failure);
    expect(toast.add).not.toHaveBeenCalled();
  });
});
