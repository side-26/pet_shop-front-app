import { DirectionProvider } from '@base-ui/react/direction-provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { createRef, type RefObject } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import type { CreateArticleDialogHandle } from './create-article-dialog.types';
import { CreateArticleDialog } from './create-article-dialog';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function renderDialog(ref: RefObject<CreateArticleDialogHandle | null>, onCreated = vi.fn()) {
  const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });

  return render(
    <QueryClientProvider client={queryClient}>
      <DirectionProvider direction="rtl">
        <CreateArticleDialog
          ref={ref}
          onCreated={onCreated}
          petTypes={[{ id: 'type-1', image: 'cat.webp', title: 'گربه' }]}
        />
      </DirectionProvider>
    </QueryClientProvider>,
  );
}

describe('CreateArticleDialog', () => {
  it('opens through its imperative handle and closes from the cancel action', async () => {
    const ref = createRef<CreateArticleDialogHandle>();

    renderDialog(ref);

    act(() => ref.current?.open());
    expect(await screen.findByRole('dialog')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'انصراف' }));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('keeps a reopened dialog mounted when a prior close fallback completes', async () => {
    const ref = createRef<CreateArticleDialogHandle>();

    renderDialog(ref);

    act(() => ref.current?.open());
    expect(await screen.findByRole('dialog')).toBeTruthy();

    vi.useFakeTimers();
    act(() => {
      ref.current?.close();
      ref.current?.open();
      vi.advanceTimersByTime(250);
    });

    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
