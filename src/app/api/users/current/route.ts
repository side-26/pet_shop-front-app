import { getCurrentUserForSessionSync } from '@/entities/users/users.service';

export async function GET() {
  const result = await getCurrentUserForSessionSync();

  return Response.json(result, { status: result.isSuccess ? 200 : 401 });
}
