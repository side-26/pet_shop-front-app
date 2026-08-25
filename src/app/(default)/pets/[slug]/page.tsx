import type { Metadata } from 'next';

import { PetDetailWrapper } from './_components/pet-detail-wrapper';
import { getPetDetail, getPetDetailSlugs } from './_components/pet-detail-data';

type PetDetailPageProps = Readonly<{ params: Promise<{ slug: string }> }>;

export function generateStaticParams() {
  return getPetDetailSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PetDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pet = getPetDetail(slug);
  if (!pet) return { title: 'حیوان پیدا نشد | پناهگاه پرشین' };
  return { title: `${pet.name}، ${pet.breed} | پناهگاه پرشین`, description: pet.description };
}

export default function PetDetailPage({ params }: PetDetailPageProps) {
  return <PetDetailWrapper paramsPromise={params} />;
}
