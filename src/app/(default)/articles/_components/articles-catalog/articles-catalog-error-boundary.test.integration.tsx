import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ArticlesCatalogErrorBoundary } from './articles-catalog-error-boundary';

vi.mock('@/hooks/use-router', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

afterEach(cleanup);

function FailedCatalog(): never {
  throw new Error('پیام خطای امن مقاله‌ها');
}

function FailedCatalogWithoutMessage(): never {
  throw new Error();
}

describe('ArticlesCatalogErrorBoundary', () => {
  it('shows the safe server error message in the feature-local fallback', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ArticlesCatalogErrorBoundary>
        <FailedCatalog />
      </ArticlesCatalogErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('پیام خطای امن مقاله‌ها');
    consoleError.mockRestore();
  });

  it('uses its feature fallback when an error has no message', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ArticlesCatalogErrorBoundary>
        <FailedCatalogWithoutMessage />
      </ArticlesCatalogErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain(
      'فهرست مقاله‌ها در حال حاضر در دسترس نیست',
    );
    consoleError.mockRestore();
  });

  it('resets a client query instead of refreshing the route when configured', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    const onQueryReset = vi.fn();

    render(
      <ArticlesCatalogErrorBoundary onQueryReset={onQueryReset}>
        <FailedCatalog />
      </ArticlesCatalogErrorBoundary>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));

    expect(onQueryReset).toHaveBeenCalledOnce();
    consoleError.mockRestore();
  });
});
