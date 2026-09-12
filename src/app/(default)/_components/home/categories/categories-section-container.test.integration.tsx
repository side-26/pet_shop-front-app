import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CategoriesSectionContainer } from './categories-section-container';

const { retryAllLandingPetTypesActionMock } = vi.hoisted(() => ({
  retryAllLandingPetTypesActionMock: vi.fn(),
}));

vi.mock('@/entities/landing/landing.actions', () => ({
  retryAllLandingPetTypesAction: retryAllLandingPetTypesActionMock,
}));

describe('CategoriesSectionContainer', () => {
  it('renders the shared fetch fallback for an expected pet-type API failure', async () => {
    const content = await CategoriesSectionContainer({
      petTypesPromise: Promise.resolve({
        isSuccess: false,
        message: 'ارتباط با سرور برقرار نشد.',
        data: { details: {}, messages: {} },
      }),
    });

    render(content);

    expect(screen.getByRole('alert').textContent).toContain('ارتباط با سرور برقرار نشد.');
    fireEvent.click(screen.getByRole('button', { name: 'دریافت دوباره اطلاعات' }));
    expect(retryAllLandingPetTypesActionMock).toHaveBeenCalledOnce();
  });

  it('keeps an empty successful collection out of the error boundary', async () => {
    await expect(
      CategoriesSectionContainer({
        petTypesPromise: Promise.resolve({ isSuccess: true, message: null, data: [] }),
      }),
    ).resolves.toBeNull();
  });
});
