import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { BrandsTable } from './brands-table';

vi.mock('./brand-enabled-switch', () => ({
  BrandEnabledSwitch: () => <span>وضعیت</span>,
}));
vi.mock('./brand-row-actions', () => ({
  BrandRowActions: () => <span>عملیات</span>,
}));

afterEach(cleanup);

describe('BrandsTable', () => {
  it('fits the table to its container and truncates a long description', () => {
    const description = 'توضیحات بسیار طولانی برند که نباید عرض جدول را بیشتر از ظرف آن کند';

    render(
      <BrandsTable
        brands={[
          {
            id: '507f1f77bcf86cd799439012',
            title: 'Royal Canin',
            titleFa: 'رویال کنین',
            description,
            logo: '',
            thumbnailLogo: '',
            isEnable: true,
          },
        ]}
      />,
    );

    const descriptionElement = screen.getByText(description);

    expect(screen.getByRole('table').className).toContain('tw:table-fixed');
    expect(descriptionElement.className).toContain('tw:truncate');
    expect(descriptionElement.getAttribute('title')).toBe(description);
    expect(descriptionElement.closest('td')?.className).toContain('tw:max-w-0');
  });
});
