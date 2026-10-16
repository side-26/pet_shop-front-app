import { NextResponse } from 'next/server';

import type { LandingPetTypeDTO } from '@/entities/landing/landing.dto';
import { customFetcher } from '@/lib/api/customFetcher';
import { throwNewCustomError } from '@/lib/api/fetcher.shared';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';

export const GET = withApiHandler(async () => {
  const result = await customFetcher<LandingPetTypeDTO[]>({
    url: '/landing/pet-types/all',
    method: 'GET',
    auth: false,
    cache: 'no-store',
  });

  if (!result.isSuccess) {
    throwNewCustomError(
      result.message ?? undefined,
      result,
      result.status ?? HTTP_STATUS.BAD_GATEWAY,
    );
  }

  return NextResponse.json(result.data);
});
