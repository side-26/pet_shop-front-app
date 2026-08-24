import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { ProductDetailContent } from './_components/product-detail-content';
import { getProductDetail, getProductDetailSlugs } from './_components/product-detail-data';

type ProductDetailPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export function generateStaticParams() {
  return getProductDetailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetail(slug);

  if (!product) {
    return { title: 'محصول پیدا نشد | پناهگاه پرشین' };
  }

  return {
    title: `${product.title} | پناهگاه پرشین`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = getProductDetail(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailContent product={product} />;
}
