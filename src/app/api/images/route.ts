import { customFetcher } from '@/lib/api/customFetcher';
import { HTTP_STATUS } from '@/lib/api/http-status';
import { withApiHandler } from '@/lib/api/with-api-handler';

export const POST = withApiHandler(async (request) => {
  try {
    const body = await request.formData();
    const result = await customFetcher<{ imageUrl: string }, unknown, FormData>({
      url: '/images',
      method: 'POST',
      body,
      auth: true,
      cache: 'no-store',
    });

    return Response.json(result, {
      status: result.isSuccess ? HTTP_STATUS.CREATED : HTTP_STATUS.BAD_REQUEST,
    });
  } catch {
    return Response.json(
      {
        isSuccess: false,
        message: 'بارگذاری تصویر ناموفق بود.',
        data: { messages: {}, details: {} },
      },
      { status: HTTP_STATUS.BAD_REQUEST },
    );
  }
});
