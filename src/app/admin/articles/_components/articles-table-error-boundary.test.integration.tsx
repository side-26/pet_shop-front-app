import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ArticlesTableErrorBoundary } from './articles-table-error-boundary';

afterEach(cleanup);

function FailedArticlesTableContent(): never {
  throw new Error('ارتباط با سرور برقرار نشد.');
}

describe('ArticlesTableErrorBoundary', () => {
  it('renders FetchErrorSection when article-table rendering fails', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ArticlesTableErrorBoundary>
        <FailedArticlesTableContent />
      </ArticlesTableErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت مقاله‌ها انجام نشد');
    expect(screen.getByRole('alert').textContent).toContain(
      'هنگام نمایش مقاله‌ها خطای غیرمنتظره‌ای رخ داد.',
    );

    consoleError.mockRestore();
  });
});
