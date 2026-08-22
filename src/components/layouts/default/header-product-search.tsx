import { Search } from 'lucide-react';

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/fields/input-group';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

type HeaderProductSearchProps = Readonly<{
  className?: string;
}>;

export function HeaderProductSearch({ className }: HeaderProductSearchProps) {
  return (
    <form
      role="search"
      action={routePaths.products}
      method="get"
      className={cn('tw:w-[min(42vw,11rem)] tw:sm:w-64 tw:lg:w-72', className)}
    >
      <InputGroup className="tw:h-11 tw:border-border/70 tw:bg-muted/75 tw:shadow-none">
        <InputGroupAddon>
          <Search aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          name="q"
          aria-label="جستجو در محصولات"
          placeholder="جستجو در محصولات..."
          autoComplete="off"
          className="tw:text-body-s"
        />
      </InputGroup>
    </form>
  );
}
