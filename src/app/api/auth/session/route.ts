import { getSession } from '@/utils/session';

export async function GET() {
  const session = await getSession();

  return Response.json({ userId: session?.userId ?? null });
}
