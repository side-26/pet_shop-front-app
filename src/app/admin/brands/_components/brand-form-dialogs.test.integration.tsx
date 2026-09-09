import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BrandDetailDialog } from './brand-detail-dialog';
import { BrandDetailFormBody } from './brand-detail-dialog-content-wrapper';
import type { BrandFormDialogHandle } from './brand-form-dialog.types';
import { BrandRowActions } from './brand-row-actions';
import { CreateBrandDialog } from './create-brand-dialog';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh }) }));
vi.mock('@/entities/brands/brands.actions', () => ({
  deleteBrandAction: vi.fn(),
}));
vi.mock('@/entities/brands/brands.client', () => ({
  useCreateBrand: () => ({ formRef: { current: null }, handleSubmit: vi.fn(), isPending: false }),
  useUpdateBrand: () => ({ formRef: { current: null }, handleSubmit: vi.fn(), isPending: false }),
}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('brand form dialogs', () => {
  it('exposes imperative open and close controls for the create dialog', async () => {
    const ref = createRef<BrandFormDialogHandle>();
    const onClosed = vi.fn();

    render(
      <DirectionProvider direction="rtl">
        <CreateBrandDialog ref={ref} onClosed={onClosed} onCreated={vi.fn()} />
      </DirectionProvider>,
    );

    expect(screen.queryByRole('dialog', { name: 'ایجاد برند جدید' })).toBeNull();
    await act(async () => ref.current?.open());
    expect(await screen.findByRole('dialog', { name: 'ایجاد برند جدید' })).toBeTruthy();
    expect(screen.queryByText('فعال')).toBeNull();
    await act(async () => ref.current?.close());
    expect(screen.queryByRole('dialog', { name: 'ایجاد برند جدید' })).toBeNull();
    expect(onClosed).toHaveBeenCalledOnce();
  });

  it('exposes the same imperative contract for detail and uses the real form as fallback', async () => {
    const ref = createRef<BrandFormDialogHandle>();
    const onClosed = vi.fn();
    const request = new Promise<never>(() => undefined);

    render(
      <DirectionProvider direction="rtl">
        <BrandDetailDialog
          ref={ref}
          brandId="507f1f77bcf86cd799439012"
          request={request}
          onClosed={onClosed}
          onUpdated={vi.fn()}
        />
      </DirectionProvider>,
    );

    await act(async () => ref.current?.open());
    expect(await screen.findByRole('dialog', { name: 'مشاهده و ویرایش برند' })).toBeTruthy();
    const titleField = await screen.findByLabelText('عنوان');
    expect(titleField.closest('form')?.className).toContain('skeleton');
    expect(titleField.matches(':disabled')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    expect(onClosed).toHaveBeenCalledOnce();
  });

  it('keeps the fallback renderer non-interactive', () => {
    render(
      <DirectionProvider direction="rtl">
        <BrandDetailFormBody formRef={{ current: null }} handleSubmit={vi.fn()} isSkeleton />
      </DirectionProvider>,
    );

    expect(document.querySelector('form[aria-busy="true"]')?.className).toContain('skeleton');
    expect(screen.getByLabelText('عنوان').matches(':disabled')).toBe(true);
    expect(screen.getByLabelText('انتخاب لوگوی برند').matches(':disabled')).toBe(true);
  });

  it('opens details from row data without a Server Action table refresh', async () => {
    render(
      <DirectionProvider direction="rtl">
        <BrandRowActions
          brand={{
            id: '507f1f77bcf86cd799439012',
            title: 'Royal Canin',
            titleFa: 'رویال کنین',
            description: 'غذای تخصصی حیوانات',
            logo: 'https://cdn.example.test/brands/royal-canin.webp',
            thumbnailLogo: 'data:image/webp;base64,thumbnail',
            isEnable: true,
          }}
        />
      </DirectionProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'عملیات Royal Canin' }));
    await act(async () => fireEvent.click(await screen.findByText('مشاهده و ویرایش')));

    expect(await screen.findByRole('dialog', { name: 'مشاهده و ویرایش برند' })).toBeTruthy();
    expect(await screen.findByDisplayValue('Royal Canin')).toBeTruthy();
    expect(screen.queryByText('فعال')).toBeNull();
    expect(refresh).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'مشاهده و ویرایش برند' })).toBeNull(),
    );
  });
});
