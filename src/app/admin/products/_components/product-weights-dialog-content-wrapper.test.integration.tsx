import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dialog } from '@/components/ui/dialog';
import { getProductWeightsAction } from '@/entities/products/products.actions';

import { ProductRowActions } from './product-row-actions';
import { ProductWeightsFormBody } from './product-weights-dialog-content-wrapper';

const refresh = vi.fn();
vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('@/entities/products/products.actions', () => ({
  getProductFormOptionsAction: vi.fn(),
  getProductImagesAction: vi.fn(),
  getProductMainInfoAction: vi.fn(),
  getProductWeightsAction: vi.fn(),
}));
vi.mock('@/entities/products/products.client', () => ({
  submitDeleteProduct: vi.fn(),
  useReplaceProductWeights: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
  useUpdateProductBaseInfo: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
  useUpdateProductImages: () => ({
    formRef: { current: null },
    handleSubmit: vi.fn(),
    isPending: false,
  }),
}));

const productId = '507f1f77bcf86cd799439010';
const getProductWeightsActionMock = vi.mocked(getProductWeightsAction);

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('product weights dialog', () => {
  it('uses the real disabled weight editor while loading', () => {
    render(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <ProductWeightsFormBody formRef={{ current: null }} handleSubmit={vi.fn()} isSkeleton />
        </Dialog>
      </DirectionProvider>,
    );

    expect(document.querySelector('form[aria-busy="true"]')?.className).toContain('skeleton');
    expect(screen.getAllByLabelText('واحد وزن').every((field) => field.matches(':disabled'))).toBe(
      true,
    );
    expect(screen.getByRole('button', { name: 'افزودن وزن' }).matches(':disabled')).toBe(true);
  });

  it('starts the request from the row action and clears the dialog when cancelled', async () => {
    getProductWeightsActionMock.mockResolvedValue({
      isSuccess: true,
      message: null,
      data: [
        {
          id: 'weight-1',
          metric: 'KG',
          value: 1,
          quantity: 4,
          price: 120000,
          discountPercentage: 10,
        },
      ],
    });

    render(
      <DirectionProvider direction="rtl">
        <ProductRowActions productId={productId} productTitle="غذای سگ" />
      </DirectionProvider>,
    );

    expect(getProductWeightsActionMock).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'عملیات غذای سگ' }));
    await act(async () => fireEvent.click(await screen.findByText('ویرایش وزن‌ها و قیمت‌ها')));

    expect(getProductWeightsActionMock).toHaveBeenCalledWith({ id: productId });
    expect(await screen.findByRole('dialog', { name: 'وزن‌ها و قیمت‌های غذای سگ' })).toBeTruthy();
    expect(await screen.findByDisplayValue('KG')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'وزن‌ها و قیمت‌های غذای سگ' })).toBeNull(),
    );
  });
});
