import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ArticlePreviewSummarySection } from './article-preview-summary-section';

describe('ArticlePreviewSummarySection', () => {
  it('renders the summary with responsive italic typography', () => {
    render(<ArticlePreviewSummarySection summary="راهنمایی کوتاه برای انتخاب بهتر." />);

    const summary = screen.getByText('راهنمایی کوتاه برای انتخاب بهتر.');

    expect(summary.className).toContain('tw:text-body-s-italic');
    expect(summary.className).toContain('md:tw:text-body-m-italic');
    expect(summary.className).toContain('lg:tw:text-body-l-italic');
  });

  it('does not render an empty summary outside the skeleton state', () => {
    const { container } = render(<ArticlePreviewSummarySection summary="   " />);

    expect(container.firstChild).toBeNull();
  });
});
