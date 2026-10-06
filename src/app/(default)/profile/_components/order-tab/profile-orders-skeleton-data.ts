import type { ProfileOrdersPageDTO } from '@/entities/profile/profile.dto';

export const profileOrdersSkeletonData: ProfileOrdersPageDTO = {
  result: [],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  },
};
