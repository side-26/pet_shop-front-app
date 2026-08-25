import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PetListDialog } from './pet-list-dialog';

afterEach(cleanup);

describe('PetListDialog', () => {
  it('bounds the surface by viewport and scrolls only the filter body', () => {
    render(<PetListDialog kind="filters" openOnMount />);

    const dialog = screen.getByRole('dialog', { name: 'فیلتر حیوانات' });
    const scrollArea = screen.getByTestId('pet-dialog-scroll-area');
    const action = screen.getByRole('button', { name: 'نمایش نتایج' });

    expect(dialog.className).toContain('tw:h-dvh');
    expect(dialog.className).toContain('tw:md:h-[70dvh]');
    expect(dialog.className).toContain('tw:overflow-hidden');
    expect(scrollArea.className).toContain('tw:overflow-y-auto');
    expect(within(scrollArea).queryByRole('button', { name: 'نمایش نتایج' })).toBeNull();
    expect(action.closest('[data-slot="dialog-footer"]')).toBeTruthy();
  });
});
