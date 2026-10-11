import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { UpdateTagsDialogHandle } from './types';
import { UpdateTagsDialogWrapper } from './wrapper';

vi.mock('./dialog', () => ({
  UpdateTagsDialog: ({ onClose, open }: { onClose: () => void; open: boolean }) =>
    open ? (
      <div role="dialog">
        <button type="button" onClick={onClose}>
          انصراف
        </button>
      </div>
    ) : null,
}));

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('UpdateTagsDialogWrapper', () => {
  it('opens and closes through its typed imperative handle', async () => {
    const ref = createRef<UpdateTagsDialogHandle>();
    render(<UpdateTagsDialogWrapper ref={ref} onUpdated={vi.fn()} />);
    act(() => ref.current?.open({ id: 'article-1' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('does not unmount a dialog reopened before a stale exit fallback completes', async () => {
    const ref = createRef<UpdateTagsDialogHandle>();
    render(<UpdateTagsDialogWrapper ref={ref} onUpdated={vi.fn()} />);
    act(() => ref.current?.open({ id: 'article-1' }));
    await screen.findByRole('dialog');
    vi.useFakeTimers();
    act(() => {
      ref.current?.close();
      ref.current?.open({ id: 'article-2' });
      vi.advanceTimersByTime(250);
    });
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
