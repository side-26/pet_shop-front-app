import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import UiComponentsPage, { metadata } from './page';

afterEach(cleanup);

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

    expect(screen.getAllByText('خیلی کوچک').length).toBeGreaterThan(0);
    expect(screen.getByText('ناموجود · tonal')).toBeTruthy();
    expect(screen.getByText('کارت شیشه‌ای')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'نمایش گفت‌وگوی بزرگ' })).toBeTruthy();
  });

  it('defines route metadata without making the page a Client Component', () => {
    expect(metadata.title).toBe('کتابخانه اجزای رابط کاربری | پت‌شاپ');
  });
});
