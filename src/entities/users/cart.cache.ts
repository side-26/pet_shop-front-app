import { EntityTag } from '@/utils/entityCache';

/** Private per-user cache tags for populated cart reads such as `/cart/all`. */
export const cartCache = new EntityTag('cart');
