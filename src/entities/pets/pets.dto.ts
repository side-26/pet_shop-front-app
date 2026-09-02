import type { PaginateDataDTO } from '@/lib/api/pagination.dto';

import type {
  CustomerPetQueryInput,
  CustomerPetPaginateQueryInput,
  ManagementPetQueryInput,
  PetInput,
  UpdatePetBaseInfoInput,
  UpdatePetImagesInput,
  UpdatePetPriceInput,
} from './pets.schema';

export type PetRelationDTO = { id: string; title: string; [key: string]: unknown };

export type ManagementPetDTO = {
  id: string;
  title: string;
  mainImage: string;
  images: string[];
  mainImageThumbnail: string;
  summary?: string;
  description: string;
  petType: PetRelationDTO | string;
  breed: PetRelationDTO | string;
  quantity: number;
  price: number;
  discountPercentage: number;
  inEnable: boolean;
  slug: string;
  createdBy?: string | null;
  updatedBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CustomerPetListItemDTO = Pick<
  ManagementPetDTO,
  | 'id'
  | 'title'
  | 'mainImage'
  | 'mainImageThumbnail'
  | 'summary'
  | 'description'
  | 'quantity'
  | 'price'
  | 'discountPercentage'
  | 'inEnable'
  | 'slug'
> & { petType: string; breed: string };

export type CustomerPetDetailDTO = CustomerPetListItemDTO & {
  images: string[];
  petType: PetRelationDTO;
  breed: PetRelationDTO;
};

export type ManagementPetsPageDTO = PaginateDataDTO<ManagementPetDTO>;
export type CustomerPetsPageDTO = PaginateDataDTO<CustomerPetListItemDTO>;
export type CustomerPetDetailsPageDTO = PaginateDataDTO<CustomerPetDetailDTO>;
export type CreatePetDTO = PetInput;
export type UpdatePetBaseInfoDTO = UpdatePetBaseInfoInput;
export type UpdatePetImagesDTO = UpdatePetImagesInput;
export type UpdatePetPriceDTO = UpdatePetPriceInput;
export type CustomerPetQueryDTO = CustomerPetQueryInput;
export type CustomerPetPaginateQueryDTO = CustomerPetPaginateQueryInput;
export type ManagementPetQueryDTO = ManagementPetQueryInput;
export type DeletePetResultDTO = { id: string };

export type PetImagesDTO = {
  mainImage: string;
  mainImageThumbnail: string;
  imagesList: string[];
};

export type PetPriceDTO = { price: number; discountPercentage: number };

export type PetBaseInfoDTO = Pick<
  ManagementPetDTO,
  'title' | 'summary' | 'description' | 'petType' | 'breed' | 'quantity'
>;
