import { NextResponse } from 'next/server';

import { USER_ROLES } from '@/configs/user-role';
import type { OrderDTO } from '@/entities/orders/orders.dto';
import { orderIdSchema } from '@/entities/orders/orders.schema';
import { InternalApiError } from '@/lib/api/InternalFetchError';
import { customFetcher } from '@/lib/api/customFetcher';
import { throwNewCustomError } from '@/lib/api/fetcher.shared';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';
import { getSession } from '@/utils/session';

type RouteContext = Readonly<{ params: Promise<{ id: string }> }>;

export const GET = withApiHandler<RouteContext>(async (_request, { params }) => {
  const session = await getSession();
  if (!session || (session.role !== USER_ROLES.ADMIN && session.role !== USER_ROLES.SELLER)) {
    throw new InternalApiError(
      'شما اجازه مشاهده این سفارش را ندارید.',
      undefined,
      HTTP_STATUS.FORBIDDEN,
    );
  }

  const { id } = await params;
  if (!(await orderIdSchema.isValid({ id }))) {
    throw new InternalApiError('شناسه سفارش نامعتبر است.', undefined, HTTP_STATUS.BAD_REQUEST);
  }

  const result = await customFetcher<OrderDTO>({
    url: `/orders/${encodeURIComponent(id)}`,
    auth: true,
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
