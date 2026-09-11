import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BrandRowActions } from './brand-row-actions';

const neverResolvingDialog = new Promise<never>(() => undefined);

vi.mock('next/dynamic', () => ({
  default: () =>
    function SuspendedDialog() {
      throw neverResolvingDialog;
    },
}));
vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/brands/brands.actions', () => ({ deleteBrandAction: vi.fn() }));

afterEach(cleanup);

describe('BrandRowActions suspense boundary', () => {
  it('keeps the table region mounted while the lazy detail dialog loads', async () => {
    render(
      <DirectionProvider direction="rtl">
        <Suspense fallback={<p>اسکلت جدول</p>}>
          <div>جدول برندها</div>
          <BrandRowActions
            brand={{
              id: '507f1f77bcf86cd799439012',
              title: 'Royal Canin',
              titleFa: 'رویال کنین',
              description: 'غذای تخصصی حیوانات',
              logo: '',
              thumbnailLogo: '',
              isEnable: true,
            }}
          />
        </Suspense>
      </DirectionProvider>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'عملیات Royal Canin' }));
    fireEvent.click(await screen.findByText('مشاهده و ویرایش'));

    expect(screen.getByText('جدول برندها')).toBeTruthy();
    expect(screen.queryByText('اسکلت جدول')).toBeNull();
  });
});
