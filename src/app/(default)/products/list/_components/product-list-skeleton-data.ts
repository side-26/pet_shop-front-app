import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';

/** Preserves the catalogue layout while its first server-rendered page is pending. */
export const productListSkeletonData: LandingProductListPageDTO = {
  result: [],
  filters: [],
  pagination: {
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
    itemsPerPage: 20,
    nextPage: null,
    prevPage: null,
    totalItems: 0,
    totalPages: 0,
  },
};
