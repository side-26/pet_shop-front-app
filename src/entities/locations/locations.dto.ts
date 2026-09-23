import type { ProvinceIdInput } from './locations.schema';

/** Coordinates from the locations API are `[latitude, longitude]`. */
export type ProvinceLatLngDTO = readonly [latitude: number, longitude: number];

export type ProvinceDTO = {
  provinceId: number;
  title: string;
  latLng?: ProvinceLatLngDTO;
};

export type CityDTO = {
  title: string;
  provinceId: number;
};

export type ProvincesDTO = ProvinceDTO[];
export type CitiesDTO = CityDTO[];
export type CitiesByProvinceIdDTO = ProvinceIdInput;
