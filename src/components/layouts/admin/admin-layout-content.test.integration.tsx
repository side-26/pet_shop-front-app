import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useAdminLayoutContext } from '@/contexts/admin/layout/admin-layout-context';

import { AdminLayoutContent } from './admin-layout-content';

function ContextConsumer() {
  const { entityName, headerActions } = useAdminLayoutContext();

  return (
    <>
      <span>{entityName}</span>
      <button type="button" onClick={headerActions.reload?.action}>
        بارگذاری دوباره
      </button>
      <button type="button" onClick={headerActions['add-new-item']?.action}>
        افزودن
      </button>
    </>
  );
}

describe('AdminLayoutContent', () => {
  it('shares reload and add-new actions with admin descendants', () => {
    const reloadData = vi.fn();
    const addNewItem = vi.fn();

    render(
      <AdminLayoutContent
        entityName="محصول"
        headerActions={{
          lastVisibleOrder: 1,
          reload: { order: 2, action: reloadData },
          'add-new-item': { order: 1, action: addNewItem },
        }}
      >
        <ContextConsumer />
      </AdminLayoutContent>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'بارگذاری دوباره' }));
    fireEvent.click(screen.getByRole('button', { name: 'افزودن' }));

    expect(reloadData).toHaveBeenCalledOnce();
    expect(addNewItem).toHaveBeenCalledOnce();
    expect(screen.getByText('محصول')).toBeTruthy();
  });
});
