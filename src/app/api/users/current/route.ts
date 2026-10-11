import { getCurrentUserForSessionSync } from '@/entities/users/users.service';
import { HTTP_STATUS } from '@/lib/api/http-status';

export async function GET() {
  const result = await getCurrentUserForSessionSync();

  return Response.json(result, {
    status: result.isSuccess ? HTTP_STATUS.OK : HTTP_STATUS.UNAUTHORIZED,
  });
}
