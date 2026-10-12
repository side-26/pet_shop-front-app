import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { routePaths } from '@/configs/route.path';

import { ArticlePreviewBackButton } from './article-preview-back-button';

const { push } = vi.hoisted(() => ({ push: vi.fn() }));

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ push }) }));

describe('ArticlePreviewBackButton', () => {
  it('navigates accessibly to the centralized article-list route', () => {
    render(<ArticlePreviewBackButton />);

    fireEvent.click(screen.getByRole('button', { name: 'بازگشت به فهرست مقاله‌ها' }));

    expect(push).toHaveBeenCalledWith(routePaths.adminArticles);
  });
});
