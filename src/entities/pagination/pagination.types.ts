export type FilterType = 'select' | 'multi-select' | 'range' | 'boolean';

export interface BaseFilterDTO {
  key: string;
  label: string;
  order: number;
}

export interface FilterOptionDTO {
  value: string;
  label: string;
  count?: number;
}

export interface SelectFilterDTO extends BaseFilterDTO {
  type: 'select';
  options: FilterOptionDTO[];
}

export interface MultiSelectFilterDTO extends BaseFilterDTO {
  type: 'multi-select';
  options: FilterOptionDTO[];
}

export interface RangeFilterDTO extends BaseFilterDTO {
  type: 'range';
  min: number;
  max: number;
  step?: number;
  unit?: string;
}

export interface BooleanFilterDTO extends BaseFilterDTO {
  type: 'boolean';
  count?: number;
}

export type FilterDTO = SelectFilterDTO | MultiSelectFilterDTO | RangeFilterDTO | BooleanFilterDTO;

export interface SortOptionDTO {
  value: string;
  label: string;
}

export interface SortDTO {
  current: string;
  options: SortOptionDTO[];
}
