import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AdditionalProperty = {
  label: string;
  value: string;
};

type AdditionalPropertiesProps = Omit<ComponentProps<'section'>, 'children'> & {
  emptyMessage?: ReactNode;
  items: readonly AdditionalProperty[];
  title?: ReactNode;
};

function AdditionalProperties({
  className,
  emptyMessage = 'مشخصاتی ثبت نشده است.',
  items,
  title = 'مشخصات بیشتر',
  ...props
}: AdditionalPropertiesProps) {
  return (
    <section className={cn('tw:flex tw:flex-col tw:gap-3', className)} {...props}>
      <h2 className="tw:text-title-s tw:text-foreground">{title}</h2>
      {items.length ? (
        <dl className="tw:divide-y tw:divide-border tw:rounded-2xl tw:border tw:border-border tw:bg-card">
          {items.map((item, index) => (
            <div
              key={`${item.label}-${index}`}
              className="tw:grid tw:grid-cols-1 tw:gap-1 tw:px-4 tw:py-3 tw:sm:grid-cols-3 tw:sm:gap-4"
            >
              <dt className="tw:text-label-m tw:text-muted-foreground">{item.label}</dt>
              <dd className="tw:sm:col-span-2 tw:text-body-m tw:text-card-foreground">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="tw:text-body-s tw:text-muted-foreground">{emptyMessage}</p>
      )}
    </section>
  );
}

export { AdditionalProperties, type AdditionalProperty, type AdditionalPropertiesProps };
