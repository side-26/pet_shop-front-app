import type {
  ManagementProductDTO,
  ManagementProductsPageDTO,
  ProductRelationDTO,
} from '@/entities/products/products.dto';

import type { ProductsPageViewModel } from './products-table.types';

function relationTitle(relation: ProductRelationDTO | string | null | undefined) {
  return relation == null ? '_' : typeof relation === 'string' ? relation : relation.title;
}

function brandTitle(brand: ProductRelationDTO | string | undefined) {
  return brand == null || typeof brand === 'string'
    ? relationTitle(brand)
    : (brand.title_fa ?? brand.title);
}

export function mapProductsPageViewModel(data: ManagementProductsPageDTO): ProductsPageViewModel {
  const products = data.result.map((product: ManagementProductDTO) => ({
    id: product.id,
    mainImage: product.mainImage,
    mainImageThumbnail: product.mainImageThumbnail,
    title: product.title,
    brand: brandTitle(product.brand),
    category: relationTitle(product.category),
    subCategory: relationTitle(product.subCategory),
    quantity: product.quantity,
    price: product.price,
    isEnable: product.isEnable,
  }));
  const total = Number(data.pagination.totalItems);
  return {
    products,
    page: Math.max(1, data.pagination.currentPage),
    pageCount: Math.max(1, data.pagination.totalPages),
    total: Number.isFinite(total) && total >= 0 ? total : products.length,
  };
}
