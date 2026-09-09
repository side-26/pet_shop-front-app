import type { FetcherResult } from '@/lib/api/fetcher.shared';

export type BrandFormDialogHandle = {
  open: () => void;
  close: () => void;
  toggle: () => void;
};

export type BrandDetailData = {
  id: string;
  title: string;
  title_fa: string;
  description: string;
  isEnable: boolean;
  logo?: string | null;
};

export type BrandDetailRequest = Promise<FetcherResult<BrandDetailData>>;
