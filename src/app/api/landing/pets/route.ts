import { NextResponse } from 'next/server';
import { ValidationError } from 'yup';

import type { LandingPetListPageDTO } from '@/entities/landing/landing.dto';
import { landingPetListQuerySchema } from '@/entities/landing/landing.schema';
import { InternalApiError } from '@/lib/api/InternalFetchError';
import { customFetcher } from '@/lib/api/customFetcher';
import { throwNewCustomError } from '@/lib/api/fetcher.shared';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';

export const GET = withApiHandler(async (request) => {
  const searchParams = new URL(request.url).searchParams;

  try {
    const query = await landingPetListQuerySchema.validate(
      {
        petType: searchParams.get('petType') ?? undefined,
        breed: searchParams.get('breed') ?? undefined,
        priceFrom: searchParams.get('priceFrom') ?? undefined,
        priceTo: searchParams.get('priceTo') ?? undefined,
        isEnable: searchParams.get('isEnable') ?? undefined,
        sort: searchParams.get('sort') ?? undefined,
        page: searchParams.get('page') ?? undefined,
        limit: searchParams.get('limit') ?? undefined,
      },
      { abortEarly: false, stripUnknown: true },
    );
    const result = await customFetcher<LandingPetListPageDTO>({
      url: '/landing/pets-paginate',
      method: 'GET',
      query,
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
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new InternalApiError(
        'پارامترهای فهرست حیوانات نامعتبر است.',
        undefined,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    throw error;
  }
});
