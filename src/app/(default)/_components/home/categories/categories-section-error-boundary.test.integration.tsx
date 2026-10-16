import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { CategoriesSectionErrorBoundary } from './categories-section-error-boundary';

vi.mock('@/entities/landing/landing.actions', () => ({
  retryAllLandingPetTypesAction: vi.fn(),
}));

afterEach(cleanup);

function FailedPetTypesContent(): never {
  throw new Error('دسته‌بندی‌ها در دسترس نیستند.');
}

describe('CategoriesSectionErrorBoundary', () => {
  it('renders the safe failure message from the rejected Server Action', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <CategoriesSectionErrorBoundary>
        <FailedPetTypesContent />
      </CategoriesSectionErrorBoundary>,
    );

    await waitFor(() =>
      expect(screen.getByRole('alert').textContent).toContain('دسته‌بندی‌ها در دسترس نیستند.'),
    );
    consoleError.mockRestore();
  });
});
