import { notFound } from 'next/navigation';

import { PetDetailContent } from './pet-detail-content';
import { getPetDetail } from './pet-detail-data';

type PetDetailContainerProps = Readonly<{
  paramsPromise: Promise<{ slug: string }>;
}>;

export async function PetDetailContainer({ paramsPromise }: PetDetailContainerProps) {
  const { slug } = await paramsPromise;
  const pet = getPetDetail(slug);

  if (!pet) {
    notFound();
  }

  return <PetDetailContent pet={pet} />;
}
