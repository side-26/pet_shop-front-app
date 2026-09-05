import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';

import type { DeleteImageDTO } from './images.dto';

export function deleteImage(input: DeleteImageDTO) {
  return customFetcher<void, unknown, DeleteImageDTO>({
    url: '/images',
    method: 'DELETE',
    body: input,
    auth: true,
    cache: 'no-store',
  });
}
