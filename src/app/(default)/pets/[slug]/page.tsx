import type { Metadata } from 'next';

import { getLandingPetBySlugAction } from '@/entities/landing/landing.actions';
import { richTextToPlainText } from '@/lib/rich-text';

import { PetDetailWrapper } from './_components/pet-detail-wrapper';

type PetDetailPageProps = Readonly<{ params: Promise<{ slug: string }> }>;

export async function generateMetadata({ params }: PetDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getLandingPetBySlugAction(slug);
  if (!result.isSuccess)
    return { title: 'حیوان پیدا نشد | پت شاپ پرشین', robots: { index: false } };
  const description =
    richTextToPlainText(result.data.description).trim() || result.data.summary?.trim();
  return {
    title: `${result.data.title} | پت شاپ پرشین`,
    description,
    alternates: { canonical: `/pets/${encodeURIComponent(result.data.slug)}` },
  };
}

export default function PetDetailPage({ params }: PetDetailPageProps) {
  return <PetDetailWrapper paramsPromise={params} />;
}
