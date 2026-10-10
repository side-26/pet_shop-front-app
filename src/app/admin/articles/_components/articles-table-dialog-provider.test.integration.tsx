import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('nextjs-toploader/app', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

import {
  ArticlesTableDialogProvider,
  useArticlesTableDialogs,
} from './articles-table-dialog-provider';

function DialogConsumer() {
  useArticlesTableDialogs();
  return <span>dialog context available</span>;
}

describe('ArticlesTableDialogProvider', () => {
  it('makes the create dialog action available to table descendants', () => {
    render(
      <ArticlesTableDialogProvider petTypes={[]}>
        <DialogConsumer />
      </ArticlesTableDialogProvider>,
    );

    expect(screen.getByText('dialog context available')).toBeTruthy();
  });
});
