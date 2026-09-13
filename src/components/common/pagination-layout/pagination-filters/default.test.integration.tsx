import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PaginationFilters } from './default';

const push = vi.fn();

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ push }) }));

afterEach(() => {
  cleanup();
  push.mockClear();
});

describe('PaginationFilters', () => {
  it('disables clearing when filter definitions exist but none is active', () => {
    render(
      <DirectionProvider direction="rtl">
        <PaginationFilters
          basePath="/products/list"
          idPrefix="products"
          label="فیلتر محصولات"
          query={{}}
          filters={[
            {
              key: 'category',
              label: 'دسته‌بندی',
              order: 1,
              type: 'select',
              options: [{ label: 'غذا', value: 'food' }],
            },
          ]}
        />
      </DirectionProvider>,
    );

    expect(screen.getByRole('button', { name: 'پاک کردن' }).hasAttribute('disabled')).toBe(true);
  });

  it('keeps the title outside the scrollable filter content when requested by a desktop sidebar', () => {
    render(
      <DirectionProvider direction="rtl">
        <PaginationFilters
          basePath="/products/list"
          idPrefix="products"
          label="فیلتر محصولات"
          query={{}}
          scrollable
          filters={[]}
        />
      </DirectionProvider>,
    );

    const card = screen.getByText('فیلتر محصولات').closest('[data-slot="card"]');
    expect(card?.getAttribute('data-scrollable')).toBe('true');
    expect(card?.className).toContain('tw:h-fit');
    expect(card?.querySelector('[data-slot="card-content"]')?.className).toContain(
      'tw:overflow-y-auto',
    );
  });

  it('renders select, multi-select, and boolean sections and removes only the chosen filter query', () => {
    render(
      <DirectionProvider direction="rtl">
        <PaginationFilters
          basePath="/products/list"
          idPrefix="products"
          label="فیلتر محصولات"
          query={{ category: 'food', brands: 'alpha,beta', available: 'false', page: '3' }}
          filters={[
            {
              key: 'category',
              label: 'دسته‌بندی',
              order: 1,
              type: 'select',
              options: [{ label: 'غذا', value: 'food' }],
            },
            {
              key: 'brands',
              label: 'برندها',
              order: 2,
              type: 'multi-select',
              options: [
                { label: 'آلفا', value: 'alpha' },
                { label: 'بتا', value: 'beta' },
              ],
            },
            { key: 'available', label: 'موجودی', order: 3, type: 'boolean' },
          ]}
        />
      </DirectionProvider>,
    );

    expect(screen.queryByRole('radio', { name: 'غذا' })).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'دسته‌بندی' }));
    fireEvent.click(screen.getByRole('button', { name: 'برندها' }));
    fireEvent.click(screen.getByRole('button', { name: 'موجودی' }));

    expect(screen.getByRole('radio', { name: 'غذا' }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('checkbox', { name: 'آلفا' }).getAttribute('aria-checked')).toBe(
      'true',
    );
    expect(screen.getByRole('switch', { name: 'موجودی' }).getAttribute('aria-checked')).toBe(
      'false',
    );

    fireEvent.click(within(screen.getByRole('group', { name: 'دسته‌بندی' })).getByRole('button'));

    expect(push).toHaveBeenCalledWith('/products/list?brands=alpha%2Cbeta&available=false&page=1', {
      scroll: false,
    });
  });
});
