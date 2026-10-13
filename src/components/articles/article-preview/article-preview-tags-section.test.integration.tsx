import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArticlePreviewTagsSection } from './article-preview-tags-section';

describe('ArticlePreviewTagsSection', () => {
  it('renders article tags as small primary tonal badges', () => {
    render(<ArticlePreviewTagsSection tags={[{ title: 'گربه' }, { title: 'تغذیه' }]} />);

    expect(screen.getByRole('heading', { level: 2, name: 'برچسب‌های مقاله' })).toBeTruthy();
    expect(screen.getAllByText('گربه')[0]?.getAttribute('data-size')).toBe('sm');
    expect(screen.getAllByText('گربه')[0]?.getAttribute('data-color')).toBe('primary');
    expect(screen.getAllByText('گربه')[0]?.getAttribute('data-variant')).toBe('tonal');
  });

  it('does not render a tags section when there are no tags', () => {
    const { container } = render(<ArticlePreviewTagsSection />);

    expect(container.firstChild).toBeNull();
  });

  it('makes tags interactive only when an optional click handler is provided', () => {
    const onClick = vi.fn();

    render(<ArticlePreviewTagsSection tags={[{ title: 'گربه' }]} onClick={onClick} />);

    const tagButton = screen.getByRole('button', { name: 'گربه' });

    expect(tagButton.className).toContain('tw:cursor-pointer');
    fireEvent.click(tagButton);

    expect(onClick).toHaveBeenCalledWith('گربه');
  });
});
