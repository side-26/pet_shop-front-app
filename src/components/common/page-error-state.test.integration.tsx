import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';

import { PageErrorState } from './page-error-state';

it('renders a status-specific icon and retries through its single recovery action', () => {
  const onRetry = vi.fn();
  render(<PageErrorState statusCode={400} errorMessage="درخواست نامعتبر است" onRetry={onRetry} />);

  expect(screen.queryByText('400')).toBeNull();
  expect(screen.getByRole('alert').querySelector('svg')).toBeTruthy();
  expect(screen.getByText('درخواست نامعتبر است')).toBeTruthy();
  fireEvent.click(screen.getByRole('button', { name: 'تلاش دوباره' }));
  expect(onRetry).toHaveBeenCalledOnce();
});
