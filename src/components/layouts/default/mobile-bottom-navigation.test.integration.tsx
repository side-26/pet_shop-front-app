import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { MobileBottomNavigationView } from './mobile-bottom-navigation';

afterEach(cleanup);

describe('MobileBottomNavigationView', () => {
  it('links visitors to login from the account destination', () => {
    render(<MobileBottomNavigationView pathname={routePaths.home} />);

    expect(screen.getByRole('link', { name: 'حساب کاربری' }).getAttribute('href')).toBe(
      routePaths.login,
    );
  });

  it('links authenticated users to their profile and marks it active', () => {
    render(
      <MobileBottomNavigationView
        pathname={routePaths.profile}
        accountHref={routePaths.profile}
        accountLabel="پروفایل"
      />,
    );

    const profileLink = screen.getByRole('link', { name: 'پروفایل' });
    expect(profileLink.getAttribute('href')).toBe(routePaths.profile);
    expect(profileLink.getAttribute('aria-current')).toBe('page');
  });
});
