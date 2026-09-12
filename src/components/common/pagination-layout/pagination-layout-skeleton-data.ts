import type { PaginationDTO } from '@/entities/pagination/pagination.dto';
import type { FilterDTO, SortDTO } from '@/entities/pagination/pagination.types';

export const paginationLayoutSkeletonPagination: PaginationDTO = {
  currentPage: 1,
  totalPages: 3,
  totalItems: 12,
  itemsPerPage: 8,
  hasNextPage: true,
  hasPrevPage: false,
  nextPage: 2,
  prevPage: null,
};

export const paginationLayoutSkeletonFilters: readonly FilterDTO[] = [
  {
    key: 'skeleton-one',
    label: 'فیلتر نمونه',
    order: 1,
    type: 'multi-select',
    options: [
      { label: 'گزینه نمونه', value: 'one' },
      { label: 'گزینه دیگر', value: 'two' },
    ],
  },
  { key: 'skeleton-two', label: 'محدوده نمونه', order: 2, type: 'range', min: 0, max: 100 },
];

export const paginationLayoutSkeletonSort: SortDTO = {
  current: 'one',
  options: [
    { label: 'مرتب‌سازی نمونه', value: 'one' },
    { label: 'گزینه دیگر', value: 'two' },
  ],
};
