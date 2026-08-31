import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useBreedStatus } from '@/entities/breeds/breeds.client';

import { BreedEnabledSwitch } from './breed-enabled-switch';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/entities/breeds/breeds.client', () => ({ useBreedStatus: vi.fn() }));

const useBreedStatusMock = vi.mocked(useBreedStatus);

afterEach(cleanup);
beforeEach(() => vi.clearAllMocks());

describe('BreedEnabledSwitch', () => {
  it('sends the next enabled state through the breed client hook', () => {
    const update = vi.fn();
    useBreedStatusMock.mockReturnValue({ isPending: false, update });
    render(
      <DirectionProvider direction="rtl">
        <BreedEnabledSwitch breedId="breed-1" breedTitle="گلدن رتریور" isEnabled />
      </DirectionProvider>,
    );

    fireEvent.click(screen.getByRole('switch', { name: 'گلدن رتریور: فعال' }));
    expect(update).toHaveBeenCalledWith('breed-1', false);
  });

  it('exposes the shared pending state accessibly', () => {
    useBreedStatusMock.mockReturnValue({ isPending: true, update: vi.fn() });
    render(
      <DirectionProvider direction="rtl">
        <BreedEnabledSwitch breedId="breed-1" breedTitle="گلدن رتریور" isEnabled={false} />
      </DirectionProvider>,
    );

    const control = screen.getByRole('switch', { name: 'گلدن رتریور: غیرفعال' });
    expect(control.getAttribute('aria-busy')).toBe('true');
    expect(control.getAttribute('aria-disabled')).toBe('true');
  });
});
