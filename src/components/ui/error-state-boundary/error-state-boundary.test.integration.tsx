import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { reportClientError } from '@/lib/logging/client-reporter';

import { ErrorStateBoundary } from '.';

vi.mock('@/lib/logging/client-reporter', () => ({ reportClientError: vi.fn() }));

afterEach(cleanup);

function ThrowRenderError(): never {
  throw new Error('Test render error');
}

describe('ErrorStateBoundary', () => {
  it('renders children when no error is caught', () => {
    render(
      <ErrorStateBoundary fallback={<p>نمایش وضعیت خطا</p>}>
        <p>محتوای سالم</p>
      </ErrorStateBoundary>,
    );

    expect(screen.getByText('محتوای سالم')).toBeTruthy();
    expect(screen.queryByText('نمایش وضعیت خطا')).toBeNull();
  });

  it('renders the supplied fallback and reports when a descendant throws', async () => {
    render(
      <ErrorStateBoundary fallback={<p role="alert">نمایش وضعیت خطا</p>}>
        <ThrowRenderError />
      </ErrorStateBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('نمایش وضعیت خطا');
    await waitFor(() =>
      expect(reportClientError).toHaveBeenCalledWith(expect.any(Error), {
        component: 'react-boundary',
        errorType: 'render_error',
      }),
    );
  });
});
