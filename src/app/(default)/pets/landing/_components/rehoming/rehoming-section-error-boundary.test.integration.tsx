import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RehomingSectionErrorBoundary } from './rehoming-section-error-boundary';

afterEach(cleanup);

function FailedRehomingContent(): never {
  throw new Error('ارتباط با سرور برقرار نشد.');
}

describe('RehomingSectionErrorBoundary', () => {
  it('renders FetchErrorSectionBoundary when the rehoming content fails', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <RehomingSectionErrorBoundary>
        <FailedRehomingContent />
      </RehomingSectionErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain(
      'دریافت حیوانات آماده واگذاری انجام نشد',
    );
    expect(screen.getByRole('alert').textContent).toContain(
      'هنگام نمایش حیوانات آماده واگذاری خطای غیرمنتظره‌ای رخ داد.',
    );

    consoleError.mockRestore();
  });
});
