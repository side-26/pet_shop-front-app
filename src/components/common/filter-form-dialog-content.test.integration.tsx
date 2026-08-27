import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Dialog } from '@/components/ui/dialog';

import { FilterFormDialogContent } from './filter-form-dialog-content';

afterEach(cleanup);

describe('FilterFormDialogContent', () => {
  it('provides filter-specific title and submit defaults while preserving the form dialog contract', () => {
    render(
      <DirectionProvider direction="rtl">
        <Dialog open>
          <FilterFormDialogContent formId="filter-form" onClose={vi.fn()}>
            <form id="filter-form">فیلترها</form>
          </FilterFormDialogContent>
        </Dialog>
      </DirectionProvider>,
    );

    expect(screen.getByRole('dialog', { name: 'فیلترها' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'اعمال فیلتر' }).getAttribute('form')).toBe(
      'filter-form',
    );
  });
});
