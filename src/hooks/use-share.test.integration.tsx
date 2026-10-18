import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useShare } from './use-share';

const originalShare = Object.getOwnPropertyDescriptor(navigator, 'share');
const originalClipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

beforeEach(() => {
  window.history.replaceState(null, '', '/products/food');
});

afterEach(() => {
  if (originalShare) Object.defineProperty(navigator, 'share', originalShare);
  else Reflect.deleteProperty(navigator, 'share');

  if (originalClipboard) Object.defineProperty(navigator, 'clipboard', originalClipboard);
  else Reflect.deleteProperty(navigator, 'clipboard');
});

describe('useShare', () => {
  it('uses the native share sheet when available', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { configurable: true, value: share });

    const { result } = renderHook(() =>
      useShare({ copiedMessage: 'پیوند کپی شد', title: 'غذای سگ' }),
    );

    await act(() => result.current.share());

    expect(share).toHaveBeenCalledWith({
      title: 'غذای سگ',
      url: `${window.location.origin}/products/food`,
    });
    expect(result.current.status).toBe('');
  });

  it('copies the current URL and reports success when native sharing is unavailable', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'share', { configurable: true, value: undefined });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });

    const { result } = renderHook(() =>
      useShare({ copiedMessage: 'پیوند محصول کپی شد', title: 'غذای سگ' }),
    );

    await act(() => result.current.share());

    expect(writeText).toHaveBeenCalledWith(`${window.location.origin}/products/food`);
    expect(result.current.status).toBe('پیوند محصول کپی شد');
  });

  it('reports a cancelled or failed share attempt', async () => {
    Object.defineProperty(navigator, 'share', {
      configurable: true,
      value: vi.fn().mockRejectedValue(new Error('cancelled')),
    });

    const { result } = renderHook(() =>
      useShare({ copiedMessage: 'پیوند کپی شد', title: 'غذای سگ' }),
    );

    await act(() => result.current.share());

    expect(result.current.status).toBe('اشتراک‌گذاری لغو شد');
  });
});
