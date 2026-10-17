import { getCurrentUserForSessionSync } from '@/entities/users/users.service';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';

export const GET = withApiHandler(async () => {
  const result = await getCurrentUserForSessionSync();

  return Response.json(result, {
    status: result.isSuccess ? HTTP_STATUS.OK : HTTP_STATUS.UNAUTHORIZED,
  });
});
