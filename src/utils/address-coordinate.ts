export type AddressCoordinate = [latitude: number, longitude: number];

export function isAddressCoordinate(value: unknown): value is AddressCoordinate {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    value.every((coordinate) => typeof coordinate === 'number' && Number.isFinite(coordinate))
  );
}
