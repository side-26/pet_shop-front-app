import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { PetListErrorBoundary } from './pet-list-error-boundary';

afterEach(cleanup);

function FailedPetListContent(): never {
  throw new Error('Catalog rendering failed.');
}

describe('PetListErrorBoundary', () => {
  it('renders the shared error section for an unexpected catalogue failure', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);

    render(
      <PetListErrorBoundary>
        <FailedPetListContent />
      </PetListErrorBoundary>,
    );

    expect(screen.getByRole('alert').textContent).toContain('دریافت فهرست حیوانات انجام نشد');
    consoleError.mockRestore();
  });
});
