import { beforeEach, describe, expect, it, vi } from 'vitest';

import { toast } from '@/components/ui/toast';
import type { FetcherError } from '@/lib/api/customFetcher';

import { globalErrorHandler } from './helpers';

vi.mock('@/components/ui/toast', () => ({
  toast: { add: vi.fn() },
}));

const toastAddMock = vi.mocked(toast.add);

const error: FetcherError<{ code: string }> = {
  isSuccess: false,
  message: 'Validation failed.',
  data: {
    messages: [
      { value: 'email', label: 'Email is invalid.' },
      { value: 'password', label: 'Password is required.' },
    ],
    details: { code: 'VALIDATION_ERROR' },
  },
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe('globalErrorHandler', () => {
  it('shows the top-level message and forwards every field error', () => {
    const showErrorFields = vi.fn();

    globalErrorHandler(error, { showErrorFields });

    expect(toastAddMock).toHaveBeenCalledWith({
      type: 'error',
      title: 'Validation failed.',
    });
    expect(showErrorFields).toHaveBeenNthCalledWith(1, 'email', {
      type: 'server',
      message: 'Email is invalid.',
    });
    expect(showErrorFields).toHaveBeenNthCalledWith(2, 'password', {
      type: 'server',
      message: 'Password is required.',
    });
  });

  it('skips absent messages without failing', () => {
    const showErrorFields = vi.fn();

    globalErrorHandler(
      {
        isSuccess: false,
        message: null,
        data: { messages: {}, details: {} },
      },
      { showErrorFields },
    );

    expect(toastAddMock).not.toHaveBeenCalled();
    expect(showErrorFields).not.toHaveBeenCalled();
  });

  it('runs only the custom callback when ignore is true', () => {
    const showErrorFields = vi.fn();
    const onCustomError = vi.fn();

    globalErrorHandler(error, { ignore: true, onCustomError, showErrorFields });

    expect(toastAddMock).not.toHaveBeenCalled();
    expect(showErrorFields).not.toHaveBeenCalled();
    expect(onCustomError).toHaveBeenCalledOnce();
    expect(onCustomError).toHaveBeenCalledWith(error);
  });

  it('runs the custom callback after the default handlers', () => {
    const calls: string[] = [];
    toastAddMock.mockImplementation(() => {
      calls.push('toast');
      return 'toast-id';
    });

    globalErrorHandler(error, {
      showErrorFields: (() => calls.push('field')) as never,
      onCustomError: () => calls.push('custom'),
    });

    expect(calls).toEqual(['toast', 'field', 'field', 'custom']);
  });
});
