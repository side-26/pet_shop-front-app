import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import UiComponentsPage, { metadata } from './page';

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselPrevious: () => <button type="button">اسلاید قبلی</button>,
  CarouselNext: () => <button type="button">اسلاید بعدی</button>,
  useCarousel: () => ({ canScrollNext: false, canScrollPrev: false }),
}));

afterEach(cleanup);

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
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

describe(routePaths.uiComponents, () => {
  it('lists every public UI component family and its supported conditions', () => {
    render(
      <DirectionProvider direction="rtl">
        <UiComponentsPage />
      </DirectionProvider>,
    );

    expect(
      screen.getByRole('heading', { level: 1, name: 'کتابخانه اجزای رابط کاربری' }),
    ).toBeTruthy();
    const sectionTitles = new Set(
      screen.getAllByRole('heading', { level: 3 }).map((heading) => heading.textContent),
    );

    expect([...sectionTitles]).toEqual(
      expect.arrayContaining([
        'Button',
        'Avatar',
        'Badge',
        'Card',
        'Expandable Card',
        'Price',
        'Price Mask / Price Mask Field',
        'Breadcrumb',
        'Alert Dialog',
        'Popover',
        'Hover Card',
        'Tooltip',
        'Spinner',
        'Dialog',
        'Form Dialog Content',
        'Filter Form Dialog Content',
        'Drawer',
        'Toast',
        'Collapsible',
        'Dropdown Menu',
        'Pagination',
        'Data Table',
        'Carousel',
        'Button Group',
        'Toggle / Toggle Group',
        'Tabs',
        'Menubar',
        'Form',
        'Input OTP Field',
        'Countdown',
        'Counter',
        'Empty',
      ]),
    );
    expect(
      screen.getByRole('button', { name: 'نمایش توضیحات کامل' }).getAttribute('aria-expanded'),
    ).toBe('false');
    expect(screen.getByRole('button', { name: 'بستن راهنما' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
    expect(screen.getByRole('button', { name: 'نمایش فرم گفتگو' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'نمایش فیلتر' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'کشوی error' })).toBeTruthy();
    expect(screen.getByRole('tablist', { name: 'اطلاعات محصول' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'وزن محصول · outlined' })).toBeTruthy();
    expect(
      screen.getByRole('heading', { level: 4, name: 'هنوز محصولی ثبت نشده است' }),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: 'افزودن محصول' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'tonal' })).toBeTruthy();
    expect(screen.getByLabelText('کد تأیید')).toBeTruthy();
    expect(screen.getAllByRole('timer').length).toBeGreaterThan(0);
    expect(screen.getByText('زمان به پایان رسید')).toBeTruthy();

    expect(screen.getAllByText('خیلی کوچک').length).toBeGreaterThan(0);
    expect(screen.getByText('خنثی · tonal')).toBeTruthy();
    expect(screen.getByText('ناموجود · tonal')).toBeTruthy();
    expect(screen.getByText('کارت شیشه‌ای')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'نمایش گفت‌وگوی بزرگ' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'حالت نمایش' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'روشن' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'تیره' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'سیستم' })).toBeTruthy();
  }, 30_000);

  it('defines route metadata without making the page a Client Component', () => {
    expect(metadata.title).toBe('کتابخانه اجزای رابط کاربری | پت‌شاپ');
  });
});
