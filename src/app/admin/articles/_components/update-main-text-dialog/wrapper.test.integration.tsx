import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { UpdateMainTextDialogHandle } from './types';
import { UpdateMainTextDialogWrapper } from './wrapper';

vi.mock('./dialog', () => ({
  UpdateMainTextDialog: ({
    id,
    onClose,
    open,
  }: {
    id: string;
    onClose: () => void;
    open: boolean;
  }) =>
    open ? (
      <div role="dialog">
        <span>{id}</span>
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

describe('UpdateMainTextDialogWrapper', () => {
  it('opens with the requested article ID and closes through its imperative handle', async () => {
    const ref = createRef<UpdateMainTextDialogHandle>();

    render(<UpdateMainTextDialogWrapper ref={ref} onUpdated={vi.fn()} />);

    act(() => ref.current?.open({ id: 'article-1' }));
    expect((await screen.findByRole('dialog')).textContent).toContain('article-1');

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps a reopened dialog mounted when a prior close fallback completes', async () => {
    const ref = createRef<UpdateMainTextDialogHandle>();

    render(<UpdateMainTextDialogWrapper ref={ref} onUpdated={vi.fn()} />);

    act(() => ref.current?.open({ id: 'article-1' }));
    expect(await screen.findByRole('dialog')).toBeTruthy();

    vi.useFakeTimers();
    act(() => {
      ref.current?.close();
      ref.current?.open({ id: 'article-2' });
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByRole('dialog').textContent).toContain('article-2');
  });
});
