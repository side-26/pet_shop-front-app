import { customFetcher } from '@/lib/api/customFetcher';

export async function POST(request: Request) {
  try {
    const body = await request.formData();
    const result = await customFetcher<{ imageUrl: string }, unknown, FormData>({
      url: '/images',
      method: 'POST',
      body,
      auth: true,
      cache: 'no-store',
    });

    return Response.json(result, { status: result.isSuccess ? 201 : 400 });
  } catch {
    return Response.json(
      {
        isSuccess: false,
        message: 'بارگذاری تصویر ناموفق بود.',
        data: { messages: {}, details: {} },
      },
      { status: 400 },
    );
  }
}
