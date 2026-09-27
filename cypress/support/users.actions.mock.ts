import type { FetcherResult } from '@/lib/api/fetcher.shared';
import type { CartDTO } from '@/entities/users/users.dto';

const unavailableInComponentTest: FetcherResult<CartDTO> = {
  isSuccess: false,
  message: 'Cart server actions are unavailable in Cypress component tests.',
  data: { messages: {}, details: {} },
};

/**
 * Component tests exercise guest-cart behavior locally. Authenticated mutations
 * are covered by the cart store unit tests, where these actions are mocked.
 */
export async function addCartItemAction(_input: unknown): Promise<FetcherResult<CartDTO>> {
  return unavailableInComponentTest;
}

export async function deleteCartItemAction(_input: unknown): Promise<FetcherResult<CartDTO>> {
  return unavailableInComponentTest;
}
