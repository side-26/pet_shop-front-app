import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

import { CategoryEnabledSwitch } from './category-enabled-switch';
import { CategoryRowActions } from './category-row-actions';
import type { CategoryPetTypeOption } from './categories-form.types';
import type { CategoryTableRow } from './categories-table.types';

type Props = {
  categories: CategoryTableRow[];
  petTypes?: readonly CategoryPetTypeOption[];
  isSkeleton?: boolean;
};

function displayValue(value: string) {
  return value.trim() || '_';
}

export function CategoriesTable({ categories, petTypes = [], isSkeleton = false }: Props) {
  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:min-h-0 tw:flex-1 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border">
        <Table>
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
            {categories.length ? (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <Avatar
                      size="lg"
                      aria-label={`تصویر ${displayValue(category.title)}`}
                      style={{
                        backgroundImage: `url("${category.mainThumbnailImage}")`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    >
                      <AvatarImage
                        src={category.mainImage}
                        alt={`تصویر ${displayValue(category.title)}`}
                      />
                      <AvatarFallback className="tw:bg-transparent" />
                    </Avatar>
                  </TableCell>
                  <TableCell className="tw:font-medium tw:whitespace-normal">
                    <div className="tw:line-clamp-2">{displayValue(category.title)}</div>
                  </TableCell>
                  <TableCell className="tw:whitespace-normal">
                    <div className="tw:line-clamp-2">{displayValue(category.petTypeTitle)}</div>
                  </TableCell>
                  <TableCell>
                    <CategoryEnabledSwitch
                      categoryId={category.id}
                      categoryTitle={displayValue(category.title)}
                      isEnabled={category.isEnable}
                      disabled={isSkeleton}
                    />
                  </TableCell>
                  <TableCell>
                    <CategoryRowActions
                      categoryId={category.id}
                      categoryTitle={displayValue(category.title)}
                      petTypes={petTypes}
                      disabled={isSkeleton}
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="tw:h-full tw:text-center tw:text-muted-foreground"
                >
                  _
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
