import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ArticleDetailTagFilterSection } from './article-detail-tag-filter-section';

const { routerPushMock } = vi.hoisted(() => ({ routerPushMock: vi.fn() }));

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ push: routerPushMock }) }));

describe('ArticleDetailTagFilterSection', () => {
  it('filters the article catalog when a tag is selected', () => {
    render(<ArticleDetailTagFilterSection tags={[{ title: 'گربه' }]} />);

    fireEvent.click(screen.getByRole('button', { name: 'گربه' }));

    expect(routerPushMock).toHaveBeenCalledWith('/articles?page=1&tags=%DA%AF%D8%B1%D8%A8%D9%87', {
      scroll: false,
    });
  });
});
