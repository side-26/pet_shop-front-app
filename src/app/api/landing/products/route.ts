import { ValidationError } from 'yup';
import { NextResponse } from 'next/server';

import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';
import { landingProductListQuerySchema } from '@/entities/landing/landing.schema';
import { InternalApiError } from '@/lib/api/InternalFetchError';
import { customFetcher } from '@/lib/api/customFetcher';
import { throwNewCustomError } from '@/lib/api/fetcher.shared';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';

export const GET = withApiHandler(async (request) => {
  const searchParams = new URL(request.url).searchParams;

  try {
    const query = await landingProductListQuerySchema.validate(
      {
        category: searchParams.get('category') ?? undefined,
        subCategory: searchParams.get('subCategory') ?? undefined,
        brand: searchParams.get('brand') ?? undefined,
        priceFrom: searchParams.get('priceFrom') ?? undefined,
        priceTo: searchParams.get('priceTo') ?? undefined,
        isEnable: searchParams.get('isEnable') ?? undefined,
        sort: searchParams.get('sort') ?? undefined,
        page: searchParams.get('page') ?? undefined,
        limit: searchParams.get('limit') ?? undefined,
      },
      { abortEarly: false, stripUnknown: true },
    );
    const result = await customFetcher<LandingProductListPageDTO>({
      url: '/landing/products',
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
        'پارامترهای فهرست محصولات نامعتبر است.',
        undefined,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    throw error;
  }
});
