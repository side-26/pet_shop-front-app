import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ArticlePreviewErrorBoundary } from './article-preview-error-boundary';

afterEach(cleanup);

function FailedArticlePreview(): never {
  throw new Error('مقاله موردنظر پیدا نشد.');
}

describe('ArticlePreviewErrorBoundary', () => {
  it('shows the normalized action error message in the fetch-error description', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <ArticlePreviewErrorBoundary>
        <FailedArticlePreview />
      </ArticlePreviewErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('مقاله موردنظر پیدا نشد.');

    consoleError.mockRestore();
  });
});
