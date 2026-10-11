import { NextResponse } from 'next/server';

import { articleIdSchema } from '@/entities/articles/articles.schema';
import type { ArticleDetailsResponse } from '@/entities/articles/articles.dto';
import { InternalApiError } from '@/lib/api/InternalFetchError';
import { customFetcher } from '@/lib/api/customFetcher';
import { throwNewCustomError } from '@/lib/api/fetcher.shared';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';

type ArticleRouteContext = Readonly<{ params: Promise<{ id: string }> }>;

export const GET = withApiHandler<ArticleRouteContext>(async (_request, { params }) => {
  const { id } = await params;

  if (!(await articleIdSchema.isValid({ id }))) {
    throw new InternalApiError('شناسه مقاله نامعتبر است.', undefined, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await customFetcher<ArticleDetailsResponse>({
    url: `/articles/id/${encodeURIComponent(id)}`,
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
