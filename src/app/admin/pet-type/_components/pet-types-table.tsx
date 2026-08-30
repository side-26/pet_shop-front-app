import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

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
              <TableHead>عنوان</TableHead>
              <TableHead>توضیحات</TableHead>
              <TableHead>وضعیت</TableHead>
              <TableHead className="tw:w-16">
                <span className="tw:sr-only">عملیات</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {petTypes.length ? (
              petTypes.map((petType) => (
                <TableRow key={petType.id}>
                  <TableCell className="tw:font-medium">{displayValue(petType.title)}</TableCell>
                  <TableCell className="tw:max-w-80 tw:truncate">
                    {displayValue(petType.description)}
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
                  colSpan={4}
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
