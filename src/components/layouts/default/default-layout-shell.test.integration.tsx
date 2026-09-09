import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
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
    expect(
      screen
        .getAllByRole('link', { name: 'حساب کاربری' })
        .every((link) => link.getAttribute('href') === routePaths.login),
    ).toBe(true);
    expect(screen.getByRole('link', { name: 'اینستاگرام پت شاپ پرشین' }).getAttribute('href')).toBe(
      'https://www.instagram.com',
    );
    expect(screen.getByRole('link', { name: 'تلگرام پت شاپ پرشین' }).getAttribute('href')).toBe(
      'https://t.me',
    );
  });

  it('keeps compact header actions accessible', () => {
    render(<DefaultLayoutShell>صفحه</DefaultLayoutShell>);

    expect(screen.getByRole('button', { name: 'باز کردن منوی بیشتر' })).toBeTruthy();
    expect(screen.getByRole('searchbox', { name: 'جستجو در محصولات' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'باز کردن جستجوی محصولات' })).toBeTruthy();
    expect(screen.getByRole('search').getAttribute('action')).toBe(routePaths.products);
    expect(screen.getAllByRole('link', { name: 'سبد خرید' })[0].getAttribute('href')).toBe(
      routePaths.cart,
    );
    expect(screen.getByRole('button', { name: 'تغییر حالت نمایش: سیستم' })).toBeTruthy();
  });

  it('moves services and about links into the mobile header overflow menu', async () => {
    render(<DefaultLayoutShell>صفحه</DefaultLayoutShell>);

    fireEvent.click(screen.getByRole('button', { name: 'باز کردن منوی بیشتر' }));

    expect((await screen.findByRole('menuitem', { name: 'خدمات ما' })).getAttribute('href')).toBe(
      routePaths.services,
    );
    expect(screen.getByRole('menuitem', { name: 'درباره ما' }).getAttribute('href')).toBe(
      routePaths.about,
    );
  });

  it('keeps the five requested mobile and tablet destinations as real links', () => {
    render(<DefaultLayoutShell>صفحه</DefaultLayoutShell>);

    const mobileNavigation = screen.getByRole('navigation', { name: 'ناوبری موبایل' });
    const links = Array.from(mobileNavigation.querySelectorAll('a'));

    expect(links).toHaveLength(5);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      routePaths.home,
      routePaths.pets,
      routePaths.products,
      routePaths.cart,
      routePaths.login,
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

  it('marks the active desktop destination', () => {
    navigationState.pathname = routePaths.products;

    render(<DefaultLayoutShell>صفحه محصولات</DefaultLayoutShell>);

    const desktopNavigation = screen.getByRole('navigation', { name: 'ناوبری اصلی' });
    expect(
      within(desktopNavigation).getByRole('link', { name: 'محصولات' }).getAttribute('aria-current'),
    ).toBe('page');
  });
});
