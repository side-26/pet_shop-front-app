import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NavigationPageBar } from './navigation-page-bar';

const { loader } = vi.hoisted(() => ({ loader: vi.fn(() => null) }));

vi.mock('nextjs-toploader', () => ({ default: loader }));

describe('NavigationPageBar', () => {
  it('uses the application primary color and compact, spinner-free configuration', () => {
    render(<NavigationPageBar />);

    expect(loader).toHaveBeenCalledWith(
      { color: 'var(--primary)', height: 3, showSpinner: false },
      undefined,
    );
  });
});
