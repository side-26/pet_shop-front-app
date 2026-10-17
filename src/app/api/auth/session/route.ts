import { getSession } from '@/utils/session';
import { withApiHandler } from '@/lib/api/with-api-handler';

export const GET = withApiHandler(async () => {
  const session = await getSession();

  return Response.json({ userId: session?.userId ?? null });
});
