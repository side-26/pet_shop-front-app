import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBrandStatus } from '@/entities/brands/brands.client';

import { BrandEnabledSwitch } from './brand-enabled-switch';

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/brands/brands.client', () => ({ useBrandStatus: vi.fn() }));

const useBrandStatusMock = vi.mocked(useBrandStatus);
const brand = {
  id: '507f1f77bcf86cd799439012',
  title: 'Royal Canin',
  titleFa: 'رویال کنین',
  description: '',
  logo: '',
  thumbnailLogo: '',
  isEnable: true,
};

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

describe('BrandEnabledSwitch', () => {
  it('sends the next enabled state through the row-local status hook', () => {
    const update = vi.fn();
    useBrandStatusMock.mockReturnValue({ isPending: false, update });

    render(
      <DirectionProvider direction="rtl">
        <BrandEnabledSwitch brand={brand} />
      </DirectionProvider>,
    );

    fireEvent.click(screen.getByRole('switch', { name: 'Royal Canin: فعال' }));
    expect(update).toHaveBeenCalledWith(brand.id, false);
  });

  it('shows and disables the switch while only that row is pending', () => {
    useBrandStatusMock.mockReturnValue({ isPending: true, update: vi.fn() });

    render(
      <DirectionProvider direction="rtl">
        <BrandEnabledSwitch brand={{ ...brand, isEnable: false }} />
      </DirectionProvider>,
    );

    const control = screen.getByRole('switch', { name: 'Royal Canin: غیرفعال' });
    expect(control.getAttribute('aria-busy')).toBe('true');
    expect(control.getAttribute('aria-disabled')).toBe('true');
  });
});
