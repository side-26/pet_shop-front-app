import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import type { getAllBrandsAction } from '@/entities/brands/brands.actions';
import { BrandsTable } from './brands-table';
export async function BrandsTableContainer({
  brandsPromise,
}: {
  brandsPromise: ReturnType<typeof getAllBrandsAction>;
}) {
  const result = await brandsPromise;
  if (!result.isSuccess)
    return (
      <Empty>
        <EmptyHeader>
          <EmptyTitle>دریافت برندها انجام نشد</EmptyTitle>
          <EmptyDescription>{result.message ?? 'خطایی رخ داد.'}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  return (
    <BrandsTable
      brands={result.data.map((brand) => ({
        id: brand.id,
        title: brand.title,
        titleFa: brand.title_fa,
        description:
          typeof brand.description === 'string'
            ? brand.description
            : JSON.stringify(brand.description),
        logo: brand.logo ?? '',
        thumbnailLogo: brand.thumbnailLogo ?? '',
        isEnable: brand.isEnable,
      }))}
    />
  );
}
