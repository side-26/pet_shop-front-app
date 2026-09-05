import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { Progress, progressVariants } from './progress';

afterEach(cleanup);

describe('Progress', () => {
  it('renders an accessible clamped progress value with a size-aware label', () => {
    render(<Progress value={42.4} size="lg" color="info" aria-label="بارگذاری تصویر" />);

    const progress = screen.getByRole('progressbar', { name: 'بارگذاری تصویر' });
    expect(progress.getAttribute('aria-valuenow')).toBe('42.4');
    expect(progress.querySelector('[data-slot="progress-indicator"]')?.getAttribute('style')).toBe(
      'width: 42.4%;',
    );
    expect(screen.getByText('42.4%').className).toContain('tw:text-label-l');
  });

  it('uses success by default at completion and only reveals children once complete', () => {
    const { rerender } = render(<Progress value={99}>بارگذاری کامل شد</Progress>);
    expect(screen.queryByText('بارگذاری کامل شد')).toBeNull();

    rerender(<Progress value={100}>بارگذاری کامل شد</Progress>);
    expect(screen.getByText('بارگذاری کامل شد')).toBeTruthy();
    expect(screen.getByRole('progressbar').parentElement?.hasAttribute('data-complete')).toBe(true);
    expect(progressVariants({ color: 'success' }).indicator()).toContain('tw:bg-success');
  });

  it('uses the configured full color and clamps out-of-range values', () => {
    render(<Progress value={120} fullColor="error" showLabel={false} />);

    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('100');
    expect(screen.queryByText('100%')).toBeNull();
    expect(progressVariants({ color: 'error' }).indicator()).toContain('tw:bg-error');
  });
});
