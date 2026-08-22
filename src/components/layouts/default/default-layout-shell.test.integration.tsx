import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { DefaultLayoutShell } from './default-layout-shell';

const navigationState = vi.hoisted(() => ({ pathname: '/' }));

vi.mock('next/navigation', () => ({
  usePathname: () => navigationState.pathname,
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
  it('renders the RTL storefront landmarks, canonical links, and child content', () => {
    render(
      <DefaultLayoutShell>
        <h1>محتوای صفحه</h1>
      </DefaultLayoutShell>,
    );

    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getByRole('main').textContent).toContain('محتوای صفحه');
    expect(screen.getByRole('contentinfo')).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'ناوبری اصلی' })).toBeTruthy();
    expect(screen.getByRole('navigation', { name: 'ناوبری موبایل' })).toBeTruthy();
    expect(screen.getAllByRole('link', { name: /صفحه اصلی/ })[0].getAttribute('href')).toBe(
      routePaths.home,
    );
    expect(screen.getAllByRole('link', { name: 'حیوانات' })[0].getAttribute('href')).toBe(
      routePaths.pets,
    );
    expect(screen.getAllByRole('link', { name: 'محصولات' })[0].getAttribute('href')).toBe(
      routePaths.products,
    );
    expect(screen.getAllByRole('link', { name: 'خدمات ما' })[0].getAttribute('href')).toBe(
      routePaths.services,
    );
    expect(screen.getAllByRole('link', { name: 'درباره ما' })[0].getAttribute('href')).toBe(
      routePaths.about,
    );
    expect(screen.getByRole('link', { name: 'حساب کاربری' }).getAttribute('href')).toBe(
      routePaths.login,
    );
    expect(
      screen.getByRole('link', { name: 'اینستاگرام پناهگاه پرشین' }).getAttribute('href'),
    ).toBe('https://www.instagram.com');
    expect(screen.getByRole('link', { name: 'تلگرام پناهگاه پرشین' }).getAttribute('href')).toBe(
      'https://t.me',
    );
  });

  it('keeps compact header actions accessible', () => {
    render(<DefaultLayoutShell>صفحه</DefaultLayoutShell>);

    expect(screen.queryByRole('button', { name: 'باز کردن منوی اصلی' })).toBeNull();
    expect(screen.getByRole('searchbox', { name: 'جستجو در محصولات' })).toBeTruthy();
    expect(screen.getByRole('search').getAttribute('action')).toBe(routePaths.products);
    expect(screen.getAllByRole('link', { name: 'سبد خرید' })[0].getAttribute('href')).toBe(
      routePaths.cart,
    );
    expect(screen.getByRole('button', { name: 'فعال‌سازی حالت تیره' })).toBeTruthy();
  });

  it('keeps the six requested mobile and tablet destinations as real links', () => {
    render(<DefaultLayoutShell>صفحه</DefaultLayoutShell>);

    const mobileNavigation = screen.getByRole('navigation', { name: 'ناوبری موبایل' });
    const links = Array.from(mobileNavigation.querySelectorAll('a'));

    expect(links).toHaveLength(6);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      routePaths.home,
      routePaths.pets,
      routePaths.products,
      routePaths.services,
      routePaths.about,
      routePaths.cart,
    ]);
  });

  it('marks the current mobile destination and clears the home active state', () => {
    navigationState.pathname = routePaths.cart;

    render(<DefaultLayoutShell>صفحه سبد خرید</DefaultLayoutShell>);

    const cartLinks = screen.getAllByRole('link', { name: 'سبد خرید' });
    const homeLinks = screen.getAllByRole('link', { name: 'خانه' });

    expect(cartLinks.at(-1)?.getAttribute('aria-current')).toBe('page');
    expect(homeLinks.every((link) => link.getAttribute('aria-current') === null)).toBe(true);
  });
});
