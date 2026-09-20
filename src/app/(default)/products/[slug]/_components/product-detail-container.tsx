import { notFound } from 'next/navigation';

import { PageErrorState } from '@/components/common/page-error-state';
import {
  getLandingProductBySlugAction,
  retryLandingProductDetailAction,
} from '@/entities/landing/landing.actions';

import { ProductDetailContent } from './product-detail-content';
import { createProductDetailViewModel } from './product-detail-data';

type ProductDetailResult = Awaited<ReturnType<typeof getLandingProductBySlugAction>>;

type ProductDetailContainerProps = Readonly<{
  productPromise: Promise<ProductDetailResult>;
  slugPromise: Promise<string>;
}>;

function isServerFailure(message: string | null) {
  return !message || /server|unexpected|timed out|reach/i.test(message);
}

export async function ProductDetailContainer({
  productPromise,
  slugPromise,
}: ProductDetailContainerProps) {
  const [result, slug] = await Promise.all([productPromise, slugPromise]);

  if (!result.isSuccess) {
    if (result.message?.includes('یافت نشد')) notFound();
    if (isServerFailure(result.message))
      throw new Error(result.message || 'Product request failed.');

    return (
      <PageErrorState
        statusCode={400}
        errorMessage={result.message}
        onRetry={retryLandingProductDetailAction.bind(null, slug)}
      />
    );
  }

  return <ProductDetailContent product={createProductDetailViewModel(result.data)} />;
}
