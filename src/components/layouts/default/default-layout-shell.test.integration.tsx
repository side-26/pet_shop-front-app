import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { DefaultLayoutShell } from './default-layout-shell';

const navigationState = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
}));

vi.mock('@/hooks/use-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock('./desktop-account-button', () => ({
  DesktopAccountButton: () => null,
}));

vi.mock('./mobile-bottom-navigation-wrapper', () => ({
  MobileBottomNavigationWrapper: () => null,
}));

beforeEach(() => {
  navigationState.pathname = routePaths.home;
  window.matchMedia = vi.fn().mockReturnValue({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  });
});

afterEach(cleanup);

describe('DefaultLayoutShell', () => {
  it('renders the RTL storefront landmarks, canonical links, and child content', async () => {
    render(
      <DefaultLayoutShell>
        <h1>محتوای صفحه</h1>
      </DefaultLayoutShell>,
    );

    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('main').textContent).toContain('محتوای صفحه');
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeTruthy();
    const quickNavigation = within(footer).getByRole('navigation', { name: 'دسترسی سریع' });
    expect(within(quickNavigation).getByRole('link', { name: 'خانه' }).getAttribute('href')).toBe(
      routePaths.home,
    );
    expect(
      within(quickNavigation).getByRole('link', { name: 'حیوانات' }).getAttribute('href'),
    ).toBe(routePaths.pets);
    expect(
      within(quickNavigation).getByRole('link', { name: 'محصولات' }).getAttribute('href'),
    ).toBe(routePaths.products);
    expect(within(quickNavigation).getByRole('link', { name: 'مقالات' }).getAttribute('href')).toBe(
      routePaths.articles,
    );
    expect(
      within(quickNavigation).getByRole('link', { name: 'درباره ما' }).getAttribute('href'),
    ).toBe(routePaths.about);
    expect(await screen.findByRole('navigation', { name: 'ناوبری اصلی' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /صفحه اصلی/ })[0].getAttribute('href')).toBe(
      routePaths.home,
    );
    expect(screen.getAllByRole('link', { name: 'حیوانات' })[0].getAttribute('href')).toBe(
      routePaths.pets,
    );
    expect(screen.getAllByRole('link', { name: 'محصولات' })[0].getAttribute('href')).toBe(
      routePaths.products,
    );
    expect(screen.getAllByRole('link', { name: 'مقالات' })[0].getAttribute('href')).toBe(
      routePaths.articles,
    );
    expect(screen.getAllByRole('link', { name: 'درباره ما' })[0].getAttribute('href')).toBe(
      routePaths.about,
    );
    expect(screen.getByRole('link', { name: 'اینستاگرام پت شاپ پرشین' }).getAttribute('href')).toBe(
      'https://www.instagram.com',
    );
    expect(screen.getByRole('link', { name: 'تلگرام پت شاپ پرشین' }).getAttribute('href')).toBe(
      'https://t.me',
    );
  });

  it('keeps desktop header actions accessible', async () => {
    render(<DefaultLayoutShell>صفحه</DefaultLayoutShell>);

    expect(
      (await screen.findByRole('searchbox', { name: 'جستجو سریع' })).getAttribute('type'),
    ).toBe('search');
    expect((await screen.findAllByRole('link', { name: 'سبد خرید' }))[0].getAttribute('href')).toBe(
      routePaths.cart,
    );
    expect(await screen.findByRole('button', { name: 'تغییر حالت نمایش: سیستم' })).toBeTruthy();
  });

  it('moves services and about links into the mobile header overflow menu', async () => {
    window.matchMedia = vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    });
    render(<DefaultLayoutShell>صفحه</DefaultLayoutShell>);

    expect(await screen.findByRole('button', { name: 'باز کردن جستجوی سریع' })).toBeTruthy();
    fireEvent.click(await screen.findByRole('button', { name: 'باز کردن منوی بیشتر' }));

    expect((await screen.findByRole('menuitem', { name: 'مقالات' })).getAttribute('href')).toBe(
      routePaths.articles,
    );
    expect(screen.getByRole('menuitem', { name: 'درباره ما' }).getAttribute('href')).toBe(
      routePaths.about,
    );
  });

  it('marks the active desktop destination', async () => {
    navigationState.pathname = routePaths.products;

    render(<DefaultLayoutShell>صفحه محصولات</DefaultLayoutShell>);

    const desktopNavigation = await screen.findByRole('navigation', { name: 'ناوبری اصلی' });
    expect(
      within(desktopNavigation).getByRole('link', { name: 'محصولات' }).getAttribute('aria-current'),
    ).toBe('page');
  });
});
