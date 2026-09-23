import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { loadProvinces } from '@/entities/locations/locations.client';

import { NeshanMapProvinceSelector } from './province-selector';

vi.mock('@/entities/locations/locations.client', () => ({ loadProvinces: vi.fn() }));

afterEach(cleanup);

describe('NeshanMapProvinceSelector', () => {
  beforeEach(() => vi.clearAllMocks());

  it('loads provinces and flies the map using Neshan longitude-latitude coordinates', async () => {
    const flyTo = vi.fn();
    vi.mocked(loadProvinces).mockResolvedValue([
      { provinceId: 8, title: 'تهران', latLng: [35.6892, 51.389] },
    ]);

    render(<NeshanMapProvinceSelector flyTo={flyTo} />);

    const trigger = screen.getByRole('combobox', { name: 'انتخاب استان' });
    expect(trigger.hasAttribute('disabled')).toBe(true);
    expect(trigger.parentElement?.getAttribute('aria-busy')).toBe('true');

    await waitFor(() => expect(trigger.hasAttribute('disabled')).toBe(false));
    fireEvent.click(trigger);
    const option = await screen.findByRole('option', { name: 'تهران' });
    fireEvent.pointerDown(option, { button: 0 });
    fireEvent.pointerUp(option, { button: 0 });
    fireEvent.click(option);

    expect(flyTo).toHaveBeenCalledWith([51.389, 35.6892]);
  });

  it('applies the Select-compatible size and does not fly without coordinates', async () => {
    const flyTo = vi.fn();
    vi.mocked(loadProvinces).mockResolvedValue([{ provinceId: 1, title: 'بدون مختصات' }]);

    render(<NeshanMapProvinceSelector flyTo={flyTo} size="xl" />);

    const trigger = await screen.findByRole('combobox', { name: 'انتخاب استان' });
    await waitFor(() => expect(trigger.hasAttribute('disabled')).toBe(false));
    expect(trigger.className).toContain('tw:h-12');

    fireEvent.click(trigger);
    fireEvent.click(await screen.findByRole('option', { name: 'بدون مختصات' }));

    expect(flyTo).not.toHaveBeenCalled();
  });
});
