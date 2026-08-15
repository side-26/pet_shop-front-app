import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import AuthLayout from './layout';

afterEach(cleanup);

describe('AuthLayout', () => {
  it('renders the brand scene and nested auth content without auth business logic', () => {
    render(
      <AuthLayout>
        <p>محتوای صفحه ورود</p>
      </AuthLayout>,
    );

    expect(screen.getByRole('main')).toBeTruthy();
    expect(screen.getByText('پت‌شاپ')).toBeTruthy();
    expect(screen.getByText('همراه مطمئن دوست کوچولوی شما')).toBeTruthy();
    expect(screen.getByRole('img', { name: 'توله‌سگ گلدن رتریور' })).toBeTruthy();
    expect(screen.getByRole('region', { name: 'محتوای احراز هویت' })).toBeTruthy();
    expect(screen.getByText('محتوای صفحه ورود')).toBeTruthy();
  });

  it('shows the three trust benefits', () => {
    render(<AuthLayout>فرم</AuthLayout>);

    expect(screen.getByText('محصولات باکیفیت')).toBeTruthy();
    expect(screen.getByText('ارسال سریع')).toBeTruthy();
    expect(screen.getByText('پشتیبانی در کنار شما')).toBeTruthy();
  });
});
