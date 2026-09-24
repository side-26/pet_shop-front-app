import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { CreateNewAddressButton } from './create-new-address-button';

vi.mock('@/components/ui/map/neshan-map/default', () => ({
  NeshanMap: ({
    children,
    ...props
  }: {
    children: (context: { flyTo: () => void }) => React.ReactNode;
  }) => <section {...props}>{children({ flyTo: vi.fn() })}</section>,
}));
vi.mock('@/components/ui/map/neshan-map/plugins/pointer', () => ({
  NeshanMapPointer: ({
    lngLat,
    setLatLng,
  }: {
    lngLat: readonly [number, number];
    setLatLng: Function;
  }) => (
    <button type="button" onClick={() => setLatLng([51.4, 35.7])}>
      نشانگر {lngLat.join(',')}
    </button>
  ),
}));
vi.mock('@/components/ui/map/neshan-map/plugins/icons/pointer', () => ({
  NeshanMapPointerIcon: { Root: () => <svg aria-hidden="true" /> },
}));
vi.mock('@/components/ui/map/neshan-map/plugins/plugin-wrapper', () => ({
  NeshanMapPluginWrapper: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/components/ui/map/neshan-map/plugins/province-selector', () => ({
  NeshanMapProvinceSelector: ({ onProvinceSelect }: { onProvinceSelect: Function }) => (
    <button
      type="button"
      onClick={() => onProvinceSelect({ provinceId: 8, title: 'تهران', latLng: [35.6892, 51.389] })}
    >
      انتخاب تهران
    </button>
  ),
}));

describe('CreateNewAddressDialog', () => {
  it('opens the location step and keeps its marker coordinate synchronized with province selection and dragging', async () => {
    render(<CreateNewAddressButton />);

    fireEvent.click(screen.getByRole('button', { name: 'افزودن نشانی جدید' }));
    expect(screen.getByRole('heading', { name: 'موقعیت نشانی را انتخاب کنید' })).toBeTruthy();
    expect(await screen.findByRole('region', { name: 'نقشه انتخاب موقعیت نشانی' })).toBeTruthy();
    expect(screen.getByText('lat: 35.689200')).toBeTruthy();
    expect(screen.getByText('lng: 51.389000')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'انتخاب تهران' }));
    expect(screen.getByText('lat: 35.689200')).toBeTruthy();
    expect(screen.getByText('lng: 51.389000')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /نشانگر 51\.389,35\.6892/ }));
    expect(screen.getByText('lat: 35.700000')).toBeTruthy();
    expect(screen.getByText('lng: 51.400000')).toBeTruthy();
  });
});
