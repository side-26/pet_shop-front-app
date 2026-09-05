import type { RichTextFormValue } from '@/lib/rich-text';

export type PetTypeTableRow = {
  id: string;
  title: string;
  description: RichTextFormValue;
  mainImage: string;
  thumbnail: string;
  isEnabled: boolean;
};
