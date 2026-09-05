import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { richTextToPlainText } from '@/lib/rich-text';

import { PetTypeEnabledSwitch } from './pet-type-enabled-switch';
import { PetTypeRowActions } from './pet-type-row-actions';
import type { PetTypeTableRow } from './pet-types-table.types';

type PetTypesTableProps = { petTypes: PetTypeTableRow[]; isLoading?: boolean };

function displayValue(value: string) {
  return value.trim() || '_';
}

export function PetTypesTable({ petTypes, isLoading = false }: PetTypesTableProps) {
  return (
    <section
      aria-busy={isLoading || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col tw:gap-4',
        isLoading && 'skeleton tw:pointer-events-none tw:select-none',
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
                <div>توضیحات</div>
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
            {petTypes.length ? (
              petTypes.map((petType) => (
                <TableRow key={petType.id}>
                  <TableCell>
                    <Avatar
                      size="lg"
                      aria-label={`تصویر ${displayValue(petType.title)}`}
                      style={{
                        backgroundImage: `url("${petType.thumbnail}")`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                      }}
                    >
                      <AvatarImage
                        src={petType.mainImage}
                        alt={`تصویر ${displayValue(petType.title)}`}
                      />
                      <AvatarFallback className="tw:bg-transparent" />
                    </Avatar>
                  </TableCell>
                  <TableCell className="tw:font-medium tw:whitespace-normal">
                    <div className="tw:line-clamp-2">{displayValue(petType.title)}</div>
                  </TableCell>
                  <TableCell className="tw:max-w-80 tw:whitespace-normal">
                    <div className="tw:line-clamp-2">
                      {displayValue(richTextToPlainText(petType.description))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <PetTypeEnabledSwitch
                      petTypeId={petType.id}
                      petTypeTitle={displayValue(petType.title)}
                      isEnabled={petType.isEnabled}
                      disabled={isLoading}
                    />
                  </TableCell>
                  <TableCell>
                    <PetTypeRowActions
                      petTypeId={petType.id}
                      petTypeTitle={petType.title}
                      disabled={isLoading}
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
