import { TablePagination } from '@/components/common/table-pagination';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import { BreedEnabledSwitch } from './breed-enabled-switch';
import { BreedRowActions } from './breed-row-actions';
import type { BreedCountryOption, BreedPetTypeOption } from './breeds-form.types';
import type { BreedTableRow } from './breeds-table.types';

type Props = {
  breeds: BreedTableRow[];
  page: number;
  pageCount: number;
  total: number;
  query?: Record<string, string>;
  countries?: readonly BreedCountryOption[];
  petTypes?: readonly BreedPetTypeOption[];
  isLoading?: boolean;
};

function displayValue(value: string) {
  return value.trim() || '_';
}

export function BreedsPaginateTable({
  breeds,
  page,
  pageCount,
  total,
  query = {},
  countries = [],
  petTypes = [],
  isLoading = false,
}: Props) {
  return (
    <section
      aria-busy={isLoading || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4',
        isLoading && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:min-h-0 tw:flex-1 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border">
        <Table className="tw:h-full">
          <TableHeader>
            <TableRow>
              <TableHead className="tw:w-16">
                <span className="tw:sr-only">تصویر</span>
              </TableHead>
              <TableHead>عنوان</TableHead>
              <TableHead>نوع حیوان</TableHead>
              <TableHead>کشور</TableHead>
              <TableHead>میانگین سن</TableHead>
              <TableHead>اندازه</TableHead>
              <TableHead>سطح فعالیت</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="tw:w-16">
                <span className="tw:sr-only">عملیات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {breeds.length ? (
              breeds.map((breed) => {
                const title = displayValue(breed.title);
                return (
                  <TableRow key={breed.id}>
                    <TableCell>
                      <Avatar
                        size="lg"
                        aria-label={`تصویر ${title}`}
                        style={{
                          backgroundImage: breed.thumbnailImage
                            ? `url("${breed.thumbnailImage}")`
                            : undefined,
                          backgroundPosition: 'center',
                          backgroundSize: 'cover',
                        }}
                      >
                        <AvatarImage src={breed.mainImage} alt={`تصویر ${title}`} />
                        <AvatarFallback className="tw:bg-transparent" />
                      </Avatar>
                    </TableCell>
                    <TableCell className="tw:font-medium">{title}</TableCell>
                    <TableCell>{displayValue(breed.petTypeTitle)}</TableCell>
                    <TableCell>{displayValue(breed.country)}</TableCell>
                    <TableCell>
                      <bdi dir="ltr">{displayValue(breed.ageAverage)}</bdi>
                    </TableCell>
                    <TableCell>{displayValue(breed.size)}</TableCell>
                    <TableCell>{displayValue(breed.activityLevel)}</TableCell>
                    <TableCell>
                      <BreedEnabledSwitch
                        breedId={breed.id}
                        breedTitle={title}
                        isEnabled={breed.isEnabled}
                        disabled={isLoading}
                      />
                    </TableCell>
                    <TableCell>
                      <BreedRowActions
                        breedId={breed.id}
                        breedTitle={title}
                        countries={countries}
                        petTypes={petTypes}
                        disabled={isLoading}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="tw:h-full">
                  <Empty>
                    <EmptyHeader>
                      <EmptyTitle>نژادی پیدا نشد</EmptyTitle>
                      <EmptyDescription>
                        فیلترها را تغییر دهید یا یک نژاد جدید ایجاد کنید.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        basePath={routePaths.adminBreeds}
        query={query}
        page={page}
        pageCount={pageCount}
        total={total}
        itemCount={breeds.length}
        itemLabel="نژاد"
        limitOptions={[10, 20, 40, 60]}
        disabled={isLoading}
      />
    </section>
  );
}
