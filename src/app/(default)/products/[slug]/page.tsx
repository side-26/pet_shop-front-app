import type { Metadata } from 'next';

import { getPublicLandingProductBySlug } from '@/entities/landing/landing.service';
import { richTextToPlainText } from '@/lib/rich-text';

import { ProductDetailSection } from './_components/product-detail-section';

type ProductDetailPageProps = Readonly<{
  params: Promise<{ slug: string }>;
}>;

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPublicLandingProductBySlug(slug);

  if (!result.isSuccess) {
    return { title: 'محصول پیدا نشد | پت شاپ پرشین', robots: { index: false, follow: false } };
  }

  const product = result.data;
  const description = richTextToPlainText(product.description).trim() || product.summary?.trim();
  return {
    title: `${product.title} | پت شاپ پرشین`,
    description,
    alternates: { canonical: `/products/${encodeURIComponent(product.slug)}` },
    openGraph: { title: product.title, description, images: [product.mainImage] },
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  return <ProductDetailSection params={params} />;
}
