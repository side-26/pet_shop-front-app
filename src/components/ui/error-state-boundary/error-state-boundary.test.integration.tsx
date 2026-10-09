import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ErrorStateBoundary } from '.';

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

  it('renders the supplied fallback when a descendant throws', () => {
    render(
      <ErrorStateBoundary fallback={<p role="alert">نمایش وضعیت خطا</p>}>
        <ThrowRenderError />
      </ErrorStateBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('نمایش وضعیت خطا');
  });
});
