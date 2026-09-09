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
    const { container } = render(
      <DirectionProvider direction="rtl">
        <UiComponentsPage />
      </DirectionProvider>,
    );
    const getButtonByName = (name: string) =>
      Array.from(container.querySelectorAll('button')).find(
        (button) =>
          button.getAttribute('aria-label') === name || button.textContent?.includes(name),
      );

    expect(container.querySelector('h1')?.textContent).toBe('کتابخانه اجزای رابط کاربری');
    const sectionTitles = new Set(
      Array.from(container.querySelectorAll('h3')).map((heading) => heading.textContent),
    );

    expect([...sectionTitles]).toEqual(
      expect.arrayContaining([
        'Button',
        'Avatar',
        'Badge',
        'Card',
        'Calendar',
        'Date Picker',
        'Ranged Date Picker',
        'Time Selector',
        'Combobox',
        'Virtual Combobox',
        'Expandable Card',
        'Price',
        'Price Mask / Price Mask Field',
        'Breadcrumb',
        'Alert Dialog',
        'Popover',
        'Hover Card',
        'Tooltip',
        'Spinner',
        'Progress',
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
        'FileField',
        'MultipleImageUploaderField',
        'Input OTP Field',
        'Countdown',
        'Counter',
        'Empty',
      ]),
    );
    expect(getButtonByName('نمایش توضیحات کامل')?.getAttribute('aria-expanded')).toBe('false');
    expect(getButtonByName('بستن راهنما')?.getAttribute('aria-expanded')).toBe('true');
    expect(getButtonByName('نمایش فرم گفتگو')).toBeTruthy();
    expect(getButtonByName('نمایش فیلتر')).toBeTruthy();
    expect(getButtonByName('کشوی error')).toBeTruthy();
    expect(container.querySelector('[role="tablist"][aria-label="اطلاعات محصول"]')).toBeTruthy();
    expect(
      container.querySelector('[role="group"][aria-label="وزن محصول · outlined"]'),
    ).toBeTruthy();
    expect(
      Array.from(container.querySelectorAll('[role="heading"][aria-level="4"]')).some(
        (heading) => heading.textContent === 'هنوز محصولی ثبت نشده است',
      ),
    ).toBe(true);
    expect(getButtonByName('افزودن محصول')).toBeTruthy();
    expect(container.querySelector('[role="group"][aria-label="tonal"]')).toBeTruthy();
    const verificationLabel = Array.from(container.querySelectorAll('label')).find((label) =>
      label.textContent?.includes('کد تأیید'),
    );
    expect(verificationLabel?.htmlFor).toBeTruthy();
    expect(container.querySelector(`[id="${verificationLabel?.htmlFor}"]`)).toBeTruthy();
    expect(container.querySelectorAll('[role="timer"]').length).toBeGreaterThan(0);
    expect(container.textContent).toContain('زمان به پایان رسید');

    expect(screen.getAllByText('خیلی کوچک').length).toBeGreaterThan(0);
    expect(screen.getByText('خنثی · tonal')).toBeTruthy();
    expect(screen.getByText('ناموجود · tonal')).toBeTruthy();
    expect(screen.getByText('کارت شیشه‌ای')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'نمایش گفت‌وگوی بزرگ' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'حالت نمایش: سیستم' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'تغییر حالت نمایش: سیستم' })).toBeTruthy();
  }, 60_000);

  it('defines route metadata without making the page a Client Component', () => {
    expect(metadata.title).toBe('کتابخانه اجزای رابط کاربری | پت‌شاپ');
  });
});
