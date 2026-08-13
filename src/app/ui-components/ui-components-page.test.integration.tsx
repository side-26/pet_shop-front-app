import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import UiComponentsPage, { metadata } from './page';

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselPrevious: () => <button type="button">اسلاید قبلی</button>,
  CarouselNext: () => <button type="button">اسلاید بعدی</button>,
}));

afterEach(cleanup);

beforeEach(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: false,
      media: '',
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  );
});

describe('/ui-components', () => {
  it('lists every public UI component family and its supported conditions', () => {
    render(
      <DirectionProvider direction="rtl">
        <UiComponentsPage />
      </DirectionProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'کتابخانه اجزای رابط کاربری' }),
    ).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Button' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Badge' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Card' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Alert Dialog' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Popover' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Tooltip' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Spinner' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Dialog' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Toast' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Collapsible' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Dropdown Menu' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Pagination' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Data Table' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Carousel' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Button Group' })).toBeTruthy();
    expect(screen.getByRole('heading', { level: 3, name: 'Menubar' })).toBeTruthy();

    expect(screen.getAllByText('خیلی کوچک').length).toBeGreaterThan(0);
    expect(screen.getByText('ناموجود · tonal')).toBeTruthy();
    expect(screen.getByText('کارت شیشه‌ای')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'نمایش گفت‌وگوی بزرگ' })).toBeTruthy();
  });

  it('defines route metadata without making the page a Client Component', () => {
    expect(metadata.title).toBe('کتابخانه اجزای رابط کاربری | پت‌شاپ');
  });
});
