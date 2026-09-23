import type { ProfileAddressDTO } from '@/entities/profile/profile.dto';

export const profileAddressesSkeletonData: ProfileAddressDTO[] = Array.from({ length: 2 }, () => ({
  province: '',
  city: '',
  detailAddress: '',
  plate: '',
  unit: null,
  postalCode: '',
  receiverIsMe: true,
  firstName: '',
  lastName: '',
  nationalCode: '',
  phoneNumber: '',
}));
