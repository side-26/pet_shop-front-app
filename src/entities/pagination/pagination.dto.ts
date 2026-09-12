export interface PaginationDTO {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextPage: number | null;
  prevPage: number | null;
}

export interface PaginateDataDTO<TData, TFilter = never, TSort = never> {
  result: TData[];
  pagination: PaginationDTO;
  filters?: TFilter extends never ? never : TFilter[];
  sort?: TSort extends never ? never : TSort;
}

export interface PaginateResponseDTO<TData, TFilter = never, TSort = never> {
  isSuccess: true;
  data: PaginateDataDTO<TData, TFilter, TSort>;
}
