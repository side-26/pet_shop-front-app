export type PetTableRow = {
  id: string;
  mainImage: string;
  mainImageThumbnail: string;
  title: string;
  petType: string;
  breed: string;
  summary: string;
  quantity: number;
  isEnable: boolean;
};

export type PetsPageViewModel = {
  pets: PetTableRow[];
  page: number;
  pageCount: number;
  total: number;
};
