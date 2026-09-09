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
import type { BrandTableRow } from './brands-table.types';
import { BrandEnabledSwitch } from './brand-enabled-switch';
import { BrandRowActions } from './brand-row-actions';
export function BrandsTable({
  brands,
  isSkeleton = false,
}: {
  brands: BrandTableRow[];
  isSkeleton?: boolean;
}) {
  return (
    <section
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:flex tw:h-10 tw:min-h-0 tw:flex-auto tw:flex-col',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:min-h-0 tw:flex-1 tw:overflow-auto tw:rounded-2xl tw:border tw:border-border tw:[&>[data-slot=table-container]]:overflow-visible">
        <Table className="tw:table-fixed">
          <TableHeader>
            <TableRow className="tw:shadow-sm">
              <TableHead className="tw:sticky tw:top-0 tw:z-10 tw:w-16 tw:bg-background">
                <div>
                  <span className="tw:sr-only">لوگو</span>
                </div>
              </TableHead>
              <TableHead className="tw:sticky tw:top-0 tw:z-10 tw:bg-background">
                <div>عنوان</div>
              </TableHead>
              <TableHead className="tw:sticky tw:top-0 tw:z-10 tw:bg-background">
                <div>عنوان فارسی</div>
              </TableHead>
              <TableHead className="tw:sticky tw:top-0 tw:z-10 tw:w-[40%] tw:bg-background">
                <div>توضیحات</div>
              </TableHead>
              <TableHead className="tw:sticky tw:top-0 tw:z-10 tw:bg-background">
                <div>وضعیت</div>
              </TableHead>
              <TableHead className="tw:sticky tw:top-0 tw:z-10 tw:w-16 tw:bg-background">
                <div>
                  <span className="tw:sr-only">عملیات</span>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>
                  <Avatar
                    size="lg"
                    style={{
                      backgroundImage: `url("${brand.thumbnailLogo}")`,
                      backgroundSize: 'cover',
                    }}
                  >
                    <AvatarImage src={brand.logo} alt={`لوگوی ${brand.title}`} />
                    <AvatarFallback />
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="tw:line-clamp-2" dir="ltr">
                    {brand.title || '_'}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="tw:line-clamp-2">{brand.titleFa || '_'}</div>
                </TableCell>
                <TableCell className="tw:max-w-0 tw:overflow-hidden">
                  <div className="tw:truncate" title={brand.description || undefined}>
                    {brand.description || '_'}
                  </div>
                </TableCell>
                <TableCell>
                  <BrandEnabledSwitch brand={brand} disabled={isSkeleton} />
                </TableCell>
                <TableCell>
                  <BrandRowActions brand={brand} disabled={isSkeleton} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}
