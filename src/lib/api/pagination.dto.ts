export interface PaginateDataDTO<D> {
  result: D[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: unknown;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface PaginateResponseDTO<D> {
  isSuccess: true;
  data: PaginateDataDTO<D>;
}
