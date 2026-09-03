import 'server-only';

import { customFetcher } from '@/lib/api/customFetcher';
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
  ProductPriceDTO,
  UpdateProductBaseInfoDTO,
  UpdateProductImagesDTO,
  UpdateProductPriceDTO,
} from './products.dto';
import { customerProductQuerySchema, managementProductQuerySchema } from './products.schema';

const productsCache = new EntityTag('products');
const queryKey = (query: CustomerProductQueryDTO | ManagementProductQueryDTO) =>
  new URLSearchParams(
    Object.entries(query)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => [key, String(value)]),
  ).toString();

export async function getCustomerProducts(input: Partial<CustomerProductQueryDTO> = {}) {
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
async function getSection<T>(id: string, section: 'images' | 'price') {
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
export const getProductPrice = (id: string) => getSection<ProductPriceDTO>(id, 'price');
function toFormData(input: CreateProductDTO | UpdateProductImagesDTO) {
  const body = new FormData();
  for (const [key, value] of Object.entries(input)) {
    if (value == null) continue;
    if (key === 'images') {
      const upload = value as CreateProductDTO['images'];
      upload.images.forEach((file, index) =>
        index === upload.mainImageIndex ? body.set('mainImage', file) : body.append('images', file),
      );
    } else body.set(key, String(value));
  }
  return body;
}
function invalidate(id?: string) {
  productsCache.invalidateList();
  if (id) productsCache.invalidateDetail(id);
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
    url: `/products/${id}`,
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
export async function updateProductPrice(id: string, input: UpdateProductPriceDTO) {
  const result = await customFetcher<ProductPriceDTO, unknown, UpdateProductPriceDTO>({
    url: `/products/${id}/price`,
    method: 'PUT',
    body: input,
    auth: true,
    cache: 'no-store',
  });
  if (result.isSuccess) invalidate(id);
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
