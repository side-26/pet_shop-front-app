import type { LandingProductListPageDTO } from '@/entities/landing/landing.dto';

import { ProductListInteractive } from './product-list-interactive';

type ProductListRendererProps = Readonly<{
  data: LandingProductListPageDTO;
  isSkeleton?: boolean;
  query: Readonly<Record<string, string>>;
}>;

export function ProductListRenderer(props: ProductListRendererProps) {
  return <ProductListInteractive {...props} />;
}
