export type BreedTableRow = {
  id: string;
  title: string;
  petTypeTitle: string;
  country: string;
  ageAverage: string;
  size: string;
  activityLevel: string;
  mainImage: string;
  thumbnailImage: string;
  isEnabled: boolean;
};

export type BreedsPageViewModel = {
  breeds: BreedTableRow[];
  page: number;
  pageCount: number;
  total: number;
};
