import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import { globalErrorHandler } from '@/utils/helpers';

import {
  createBrandAction,
  deleteBrandAction,
  disableBrandAction,
  enableBrandAction,
} from './brands.actions';
import { submitBrandEnabledUpdate, submitCreateBrand, submitDeleteBrand } from './brands.client';

vi.mock('./brands.actions', () => ({
  createBrandAction: vi.fn(),
  deleteBrandAction: vi.fn(),
  disableBrandAction: vi.fn(),
  enableBrandAction: vi.fn(),
}));
vi.mock('@/components/ui/toast', () => ({ toast: { add: vi.fn() } }));
vi.mock('@/utils/helpers', () => ({ globalErrorHandler: vi.fn() }));

const id = '507f1f77bcf86cd799439012';
const input = { title: 'Royal Canin', title_fa: 'رویال کنین', description: '', isEnable: true };
const failure = {
  isSuccess: false as const,
  message: 'ناموفق',
  data: { messages: [], details: {} },
};

describe('brand client orchestration', () => {
  beforeEach(() => vi.clearAllMocks());

  it('submits creation and shows the backend success message', async () => {
    vi.mocked(createBrandAction).mockResolvedValue({
      isSuccess: true,
      message: 'برند ایجاد شد.',
      data: {} as never,
    });
    await expect(submitCreateBrand(input, vi.fn())).resolves.toBe(true);
    expect(createBrandAction).toHaveBeenCalledWith(input);
    expect(toast.add).toHaveBeenCalledWith({ type: 'success', title: 'برند ایجاد شد.' });
  });

  it.each([
    [true, enableBrandAction],
    [false, disableBrandAction],
  ] as const)('selects the matching status action', async (enabled, action) => {
    vi.mocked(action).mockResolvedValue({
      isSuccess: true,
      message: 'وضعیت تغییر کرد.',
      data: {} as never,
    });
    await expect(submitBrandEnabledUpdate(id, enabled)).resolves.toBe(true);
    expect(action).toHaveBeenCalledWith({ id });
  });

  it('forwards creation and deletion errors to the shared handler', async () => {
    vi.mocked(createBrandAction).mockResolvedValue(failure);
    vi.mocked(deleteBrandAction).mockResolvedValue(failure);
    const setError = vi.fn();
    await expect(submitCreateBrand(input, setError)).resolves.toBe(false);
    await expect(submitDeleteBrand(id)).resolves.toBe(false);
    expect(globalErrorHandler).toHaveBeenNthCalledWith(1, failure, { showErrorFields: setError });
    expect(globalErrorHandler).toHaveBeenNthCalledWith(2, failure);
    expect(toast.add).not.toHaveBeenCalled();
  });
});
