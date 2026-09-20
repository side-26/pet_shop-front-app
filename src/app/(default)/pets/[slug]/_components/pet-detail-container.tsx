import { notFound } from 'next/navigation';

import { PageErrorState } from '@/components/common/page-error-state';
import { retryLandingPetDetailAction } from '@/entities/landing/landing.actions';
import type { getLandingPetBySlug } from '@/entities/landing/landing.service';

import { PetDetailContent } from './pet-detail-content';
import { createPetDetailViewModel } from './pet-detail-data';

type PetDetailContainerProps = Readonly<{
  petPromise: Promise<Awaited<ReturnType<typeof getLandingPetBySlug>>>;
  slugPromise: Promise<string>;
}>;

export async function PetDetailContainer({ petPromise, slugPromise }: PetDetailContainerProps) {
  const [result, slug] = await Promise.all([petPromise, slugPromise]);
  if (!result.isSuccess) {
    if (result.message?.includes('یافت نشد')) notFound();
    return (
      <PageErrorState
        statusCode={500}
        errorMessage={result.message}
        title="بارگذاری حیوان کامل نشد"
        onRetry={retryLandingPetDetailAction.bind(null, slug)}
      />
    );
  }
  return <PetDetailContent pet={createPetDetailViewModel(result.data)} />;
}
