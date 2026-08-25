import { ArrowDownUp } from 'lucide-react';

import { Button } from '@/components/ui/button';

type ListingSortToolbarProps = Readonly<{
  options: readonly string[];
}>;

export function ListingSortToolbar({ options }: ListingSortToolbarProps) {
  return (
    <div className="tw:hidden tw:items-center tw:justify-between tw:gap-4 tw:rounded-2xl tw:border tw:border-border/70 tw:bg-card tw:p-3 tw:lg:flex">
      <div className="tw:flex tw:items-center tw:gap-2 tw:text-label-m tw:text-muted-foreground">
        <ArrowDownUp aria-hidden="true" />
        <span>مرتب‌سازی:</span>
      </div>
      <div className="tw:flex tw:flex-wrap tw:justify-end tw:gap-1">
        {options.map((option, index) => (
          <Button
            key={option}
            size="sm"
            variant={index === 0 ? 'tonal' : 'flat'}
            color={index === 0 ? 'primary' : 'secondary'}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
