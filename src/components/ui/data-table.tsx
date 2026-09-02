'use client';

import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  emptyLabel?: string;
  pageSize?: number;
  getRowId?: (row: TData, index: number) => string;
};

function DataTable<TData, TValue>({
  columns,
  data,
  emptyLabel = 'داده‌ای برای نمایش وجود ندارد.',
  pageSize = 5,
  getRowId,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  // TanStack Table intentionally returns a stateful API whose methods are not compiler-memoizable.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    initialState: { pagination: { pageSize } },
  });

  return (
    <div data-slot="data-table" className="tw:flex tw:flex-col tw:gap-4">
      <div className="tw:overflow-hidden tw:rounded-2xl tw:border tw:border-border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((group) => (
              <TableRow key={group.id}>
                {group.headers.map((header) => (
                  <TableHead key={header.id}>
                    <div>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {row.getVisibleCells().map((cell) => {
                    const content = flexRender(cell.column.columnDef.cell, cell.getContext());
                    const value = cell.getValue();
                    const isPlainText =
                      typeof value === 'string' &&
                      columns.some(
                        (column) =>
                          column.cell === undefined &&
                          (column.id === cell.column.id ||
                            ('accessorKey' in column && column.accessorKey === cell.column.id)),
                      );

                    return (
                      <TableCell key={cell.id} className="tw:whitespace-normal">
                        {isPlainText ? <div className="tw:line-clamp-2">{value}</div> : content}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="tw:h-24 tw:text-center tw:text-muted-foreground"
                >
                  {emptyLabel}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="tw:flex tw:items-center tw:justify-between tw:gap-3">
        <p className="tw:text-body-s tw:text-muted-foreground">
          صفحه {table.getState().pagination.pageIndex + 1} از {table.getPageCount() || 1}
        </p>
        <div className="tw:flex tw:gap-2">
          <Button
            variant="outlined"
            color="primary"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            قبلی
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            بعدی
          </Button>
        </div>
      </div>
    </div>
  );
}

export { DataTable, type DataTableProps, type ColumnDef };
