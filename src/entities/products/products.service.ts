import 'server-only';

import { customFetcher, type FetcherResult } from '@/lib/api/customFetcher';
import {
  invalidateLandingFeaturedProducts,
  invalidateLandingHomeOffers,
  invalidateLandingPopularBrands,
  invalidateLandingPopularProducts,
  invalidateLandingProductLists,
} from '@/entities/landing/landing.service';
import { EntityTag } from '@/utils/entityCache';
import type {
  CreateProductDTO,
  CustomerProductDetailDTO,
  CustomerProductQueryDTO,
  CustomerProductsPageDTO,
  DeleteProductResultDTO,
  ManagementProductDTO,
  ManagementProductQueryDTO,
  ManagementProductsPageDTO,
  ProductBaseInfoDTO,
  ProductImagesDTO,
  ProductPropertyDefinitionsDTO,
  ProductPriceDTO,
  ProductWeightsDTO,
  ReplaceProductWeightsDTO,
  ReplaceProductWeightsResultDTO,
  ReplaceProductPropertyDefinitionsDTO,
  ReplaceProductPropertyDefinitionsResultDTO,
  ProductUserRateDTO,
  UpdateProductBaseInfoDTO,
  UpdateProductImagesDTO,
  UpdateProductPriceDTO,
  UpdateProductUserRateDTO,
} from './products.dto';
import { customerProductQuerySchema, managementProductQuerySchema } from './products.schema';

const productsCache = new EntityTag('products');
const queryKey = (query: CustomerProductQueryDTO | ManagementProductQueryDTO) =>
  new URLSearchParams(
    Object.entries(query)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, String(value)]),
  ).toString();

export async function getCustomerProducts(
  input: Partial<CustomerProductQueryDTO> | Readonly<Record<string, string>> = {},
) {
  return fetchCustomerProducts(
    await customerProductQuerySchema.validate(input, { stripUnknown: true }),
  );
}
async function fetchCustomerProducts(query: CustomerProductQueryDTO) {
  'use cache';
  productsCache.cacheLife({ stale: 600 });
  productsCache.registerList(`customer:${queryKey(query)}`);
  return customFetcher<CustomerProductsPageDTO>({
    url: '/products',
    method: 'GET',
    query,
    auth: false,
    cache: 'force-cache',
    next: { tags: [productsCache.list] },
  });
}
export async function getCustomerProduct(id: string) {
  'use cache';
  productsCache.cacheLife({ stale: 600 });
  productsCache.registerDetail(id);
  return customFetcher<CustomerProductDetailDTO>({
    url: `/products/customer/${id}`,
    method: 'GET',
    auth: false,
    cache: 'force-cache',
    next: { tags: [productsCache.detail(id)] },
  });
}
export async function getManagementProducts(input: Partial<ManagementProductQueryDTO> = {}) {
  return fetchManagementProducts(
    await managementProductQuerySchema.validate(input, { stripUnknown: true }),
  );
}
async function fetchManagementProducts(query: ManagementProductQueryDTO) {
  'use cache: private';
  productsCache.cacheLife({ stale: 600 });
  productsCache.registerList(`management:${queryKey(query)}`);
  return customFetcher<ManagementProductsPageDTO>({
    url: '/products/paginate',
    method: 'GET',
    query,
    auth: true,
    cache: 'no-store',
  });
}
export async function getManagementProduct(id: string) {
  'use cache: private';
  productsCache.cacheLife({ stale: 600 });
  productsCache.registerDetail(id);
  return customFetcher<ManagementProductDTO>({
    url: `/products/manage/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}
async function getSection<T>(id: string, section: 'images' | 'main-info' | 'weights') {
  'use cache: private';
  productsCache.cacheLife({ stale: 600 });
  productsCache.registerDetail(id);
  return customFetcher<T>({
    url: `/products/${id}/${section}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}
export const getProductImages = (id: string) => getSection<ProductImagesDTO>(id, 'images');
export const getProductMainInfo = (id: string) => getSection<ProductBaseInfoDTO>(id, 'main-info');
export async function getProductWeights(id: string) {
  'use cache: private';

  productsCache.cacheLife({ stale: 600 });
  productsCache.registerDetail(id);
  return customFetcher<ProductWeightsDTO>({
    url: `/products/weights/${id}`,
    method: 'GET',
    auth: true,
    cache: 'no-store',
  });
}
export async function getProductPropertyDefinitions(id: string) {
  'use cache';

  productsCache.cacheLife({ stale: 600 });
  productsCache.registerDetail(id);
  return customFetcher<ProductPropertyDefinitionsDTO>({
    url: `/products/property-definitions/${id}`,
    method: 'GET',
    auth: false,
    cache: 'force-cache',
    next: { tags: [productsCache.detail(id)] },
  });
}
/**
 * @deprecated The backend no longer exposes a product-level price. Use
 * `getProductWeights` and render/edit the returned variants instead.
 */
export async function getProductPrice(id: string) {
  const result = await getProductWeights(id);
  if (!result.isSuccess) return result;
  const selected = result.data.reduce<ProductPriceDTO | null>((cheapest, weight) => {
    const payable = weight.price * (1 - weight.discountPercentage / 100);
    const cheapestPayable = cheapest
      ? cheapest.price * (1 - cheapest.discountPercentage / 100)
      : Number.POSITIVE_INFINITY;
    return payable < cheapestPayable
      ? { price: weight.price, discountPercentage: weight.discountPercentage }
      : cheapest;
  }, null);
  return { ...result, data: selected ?? { price: 0, discountPercentage: 0 } };
}
function toFormData(input: CreateProductDTO | UpdateProductImagesDTO) {
  const body = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value == null) continue;
    if (key === 'images') {
      const upload = value as CreateProductDTO['images'];
      upload.images.forEach((file, index) =>
        index === upload.mainImageIndex ? body.set('mainImage', file) : body.append('images', file),
      );
    } else if (key !== 'quantity') {
      body.set(key, key === 'description' ? JSON.stringify(value) : String(value));
    }
  }
  return body;
}
function invalidate(id?: string) {
  productsCache.invalidateList();
  if (id) productsCache.invalidateDetail(id);
  invalidateLandingHomeOffers();
  invalidateLandingFeaturedProducts();
  invalidateLandingPopularProducts();
  invalidateLandingPopularBrands();
  invalidateLandingProductLists();
}
export async function createProduct(input: CreateProductDTO) {
  const result = await customFetcher<ManagementProductDTO, unknown, FormData>({
    url: '/products',
    method: 'POST',
    body: toFormData(input),
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate();
  return result;
}
export async function updateProductBaseInfo(id: string, input: UpdateProductBaseInfoDTO) {
  const result = await customFetcher<ProductBaseInfoDTO, unknown, UpdateProductBaseInfoDTO>({
    url: `/products/${id}/main-info`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
export async function updateProductImages(id: string, input: UpdateProductImagesDTO) {
  const result = await customFetcher<ProductImagesDTO, unknown, FormData>({
    url: `/products/${id}/images`,
    method: 'PUT',
    body: toFormData(input),
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
export async function updateProductPrice(
  id: string,
  input: UpdateProductPriceDTO,
): Promise<FetcherResult<ProductPriceDTO>> {
  void id;
  void input;
  return {
    isSuccess: false as const,
    message: 'قیمت و تخفیف اکنون باید برای هر وزن محصول ثبت شوند.',
    data: { messages: {}, details: {} },
  };
}
export async function replaceProductWeights(input: ReplaceProductWeightsDTO) {
  const result = await customFetcher<
    ReplaceProductWeightsResultDTO,
    unknown,
    ReplaceProductWeightsDTO
  >({
    url: '/products/range',
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(input.id);
  return result;
}
export async function replaceProductPropertyDefinitions(
  input: ReplaceProductPropertyDefinitionsDTO,
) {
  const result = await customFetcher<
    ReplaceProductPropertyDefinitionsResultDTO,
    unknown,
    ReplaceProductPropertyDefinitionsDTO
  >({
    url: '/products/property-definitions',
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(input.id);
  return result;
}
export async function updateProductUserRate(input: UpdateProductUserRateDTO) {
  const result = await customFetcher<
    ProductUserRateDTO,
    unknown,
    Pick<UpdateProductUserRateDTO, 'userRate'>
  >({
    url: `/products/${input.id}/user-rate`,
    method: 'PATCH',
    body: { userRate: input.userRate },
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(input.id);
  return result;
}
async function updateStatus(id: string, status: 'enable' | 'disable') {
  const result = await customFetcher<ManagementProductDTO, unknown, undefined>({
    url: `/products/${id}/${status}`,
    method: 'PATCH',
    body: undefined,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
export const enableProduct = (id: string) => updateStatus(id, 'enable');
export const disableProduct = (id: string) => updateStatus(id, 'disable');
export async function deleteProduct(id: string) {
  const result = await customFetcher<DeleteProductResultDTO>({
    url: `/products/${id}`,
    method: 'DELETE',
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
  return result;
}
