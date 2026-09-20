import { DirectionProvider } from '@base-ui/react/direction-provider';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { ExpandableDrawer, type ExpandableDrawerHandle } from './index';

afterEach(cleanup);

function renderExpandableDrawer(ref = createRef<ExpandableDrawerHandle>()) {
  render(
    <DirectionProvider direction="rtl">
      <ExpandableDrawer
        ref={ref}
        collapsedHeight={64}
        showMoreLabel="جزئیات کامل"
        title="توضیحات محصول"
        sectionChildren={<p>خلاصه توضیحات محصول</p>}
        drawerChildren={<p>توضیحات کامل و طولانی محصول</p>}
      />
    </DirectionProvider>,
  );

  return ref;
}

describe('ExpandableDrawer', () => {
  it('keeps the preview collapsed and opens the complete content in the Drawer', () => {
    renderExpandableDrawer();

    const trigger = screen.getByRole('button', { name: 'جزئیات کامل' });

    expect(trigger.getAttribute('aria-haspopup')).toBe('dialog');
    expect(screen.queryByText('توضیحات کامل و طولانی محصول')).toBeNull();

    fireEvent.click(trigger);

    expect(screen.getByText('توضیحات کامل و طولانی محصول')).toBeTruthy();
    expect(screen.getByText('خلاصه توضیحات محصول')).toBeTruthy();
  });

  it('exposes imperative Drawer controls', () => {
    const ref = renderExpandableDrawer();

    act(() => ref.current?.open());
    expect(screen.getByText('توضیحات کامل و طولانی محصول')).toBeTruthy();

    act(() => ref.current?.close());
    expect(screen.queryByText('توضیحات کامل و طولانی محصول')).toBeNull();
  });
});
