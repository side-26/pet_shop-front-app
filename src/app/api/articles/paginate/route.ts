import { ValidationError } from 'yup';
import { NextResponse } from 'next/server';

import {
  toArticlePaginatedResponse,
  type ArticlePaginatedResponse,
} from '@/entities/articles/articles.dto';
import { articlePaginationSchema } from '@/entities/articles/articles.schema';
import { InternalApiError } from '@/lib/api/InternalFetchError';
import { customFetcher } from '@/lib/api/customFetcher';
import { throwNewCustomError } from '@/lib/api/fetcher.shared';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';

export const GET = withApiHandler(async (request) => {
  const searchParams = new URL(request.url).searchParams;

  try {
    const query = await articlePaginationSchema.validate(
      {
        tags: searchParams.getAll('tags'),
        petType: searchParams.get('petType') ?? undefined,
        sort: searchParams.get('sort') ?? undefined,
        page: searchParams.get('page') ?? undefined,
        limit: searchParams.get('limit') ?? undefined,
      },
      { abortEarly: false, stripUnknown: true },
    );

    const result = await customFetcher<ArticlePaginatedResponse>({
      url: '/articles/paginate',
      method: 'GET',
      query,
      auth: false,
      cache: 'no-store',
      parseSuccess: toArticlePaginatedResponse,
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
        'پارامترهای فهرست مقاله نامعتبر است.',
        undefined,
        HTTP_STATUS.BAD_REQUEST,
      );
    }

    throw error;
  }
});
