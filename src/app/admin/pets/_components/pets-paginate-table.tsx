import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { TablePagination } from '@/components/common/table-pagination';
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

import { PetEnabledSwitch } from './pet-enabled-switch';
import { PetRowActions } from './pet-row-actions';
import type { PetsPageViewModel } from './pets-table.types';

type Props = PetsPageViewModel & {
  query: Record<string, string>;
  isLoading?: boolean;
};

export function PetsPaginateTable({
  pets,
  page,
  pageCount,
  total,
  query,
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
                <div>
                  <span className="tw:sr-only">تصویر</span>
                </div>
              </TableHead>
              <TableHead>
                <div>عنوان</div>
              </TableHead>
              <TableHead>
                <div>نوع حیوان</div>
              </TableHead>
              <TableHead>
                <div>نژاد</div>
              </TableHead>
              <TableHead>
                <div>خلاصه</div>
              </TableHead>
              <TableHead>
                <div>موجودی</div>
              </TableHead>
              <TableHead>
                <div>وضعیت</div>
              </TableHead>
              <TableHead className="tw:w-16">
                <div>
                  <span className="tw:sr-only">عملیات</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pets.length ? (
              pets.map((pet) => (
                <TableRow key={pet.id}>
                  <TableCell>
                    <Avatar
                      size="lg"
                      style={
                        pet.mainImageThumbnail
                          ? {
                              backgroundImage: `url(${pet.mainImageThumbnail})`,
                              backgroundSize: 'cover',
                            }
                          : undefined
                      }
                    >
                      {pet.mainImage ? <AvatarImage src={pet.mainImage} alt={pet.title} /> : null}
                      <AvatarFallback
                        className={cn(
                          pet.mainImageThumbnail && 'tw:bg-transparent tw:text-transparent',
                        )}
                      >
                        {pet.title.slice(0, 1) || '_'}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="tw:font-medium tw:whitespace-normal">
                    <div className="tw:line-clamp-2">{pet.title}</div>
                  </TableCell>
                  <TableCell className="tw:whitespace-normal">
                    <div className="tw:line-clamp-2">{pet.petType}</div>
                  </TableCell>
                  <TableCell className="tw:whitespace-normal">
                    <div className="tw:line-clamp-2">{pet.breed}</div>
                  </TableCell>
                  <TableCell className="tw:max-w-64 tw:whitespace-normal">
                    <div className="tw:line-clamp-2">{pet.summary}</div>
                  </TableCell>
                  <TableCell>{pet.quantity}</TableCell>
                  <TableCell>
                    <PetEnabledSwitch
                      petId={pet.id}
                      petTitle={pet.title}
                      isEnable={pet.isEnable}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <PetRowActions petId={pet.id} petTitle={pet.title} disabled={isLoading} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="tw:h-full tw:text-center tw:text-muted-foreground"
                >
                  _
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <TablePagination
        basePath={routePaths.adminPets}
        query={query}
        page={page}
        pageCount={pageCount}
        total={total}
        itemCount={pets.length}
        itemLabel="حیوان"
        limitOptions={[10, 20, 50, 100]}
        disabled={isLoading}
      />
    </section>
  );
}
