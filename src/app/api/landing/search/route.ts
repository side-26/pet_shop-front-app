import { ValidationError } from 'yup';
import { NextResponse } from 'next/server';

import type { LandingSearchPageDTO } from '@/entities/landing/landing.dto';
import { landingSearchQuerySchema } from '@/entities/landing/landing.schema';
import { InternalApiError } from '@/lib/api/InternalFetchError';
import { customFetcher } from '@/lib/api/customFetcher';
import { throwNewCustomError } from '@/lib/api/fetcher.shared';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';

export const GET = withApiHandler(async (request) => {
  const searchParams = new URL(request.url).searchParams;

  try {
    const query = await landingSearchQuerySchema.validate(
      {
        search: searchParams.get('search') ?? undefined,
        page: searchParams.get('page') ?? undefined,
        limit: searchParams.get('limit') ?? undefined,
      },
      { abortEarly: false, stripUnknown: true },
    );
    const result = await customFetcher<LandingSearchPageDTO>({
      url: '/landing/search',
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
        'پارامترهای جستجوی آیتم‌ها نامعتبر است.',
        undefined,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    throw error;
  }
});
