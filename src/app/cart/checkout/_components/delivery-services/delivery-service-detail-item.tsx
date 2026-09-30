import type { LucideIcon } from 'lucide-react';

type DeliveryServiceDetailItemProps = Readonly<{
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}>;

export function DeliveryServiceDetailItem({
  icon: Icon,
  label,
  value,
}: DeliveryServiceDetailItemProps) {
  return (
    <div className="tw:flex tw:min-w-0 tw:items-start tw:gap-2 tw:rounded-xl tw:bg-muted/65 tw:p-3">
      <Icon aria-hidden="true" className="tw:mt-0.5 tw:size-4 tw:shrink-0 tw:text-primary" />
      <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-0.5">
        <span className="tw:text-label-s tw:text-muted-foreground">{label}</span>
        <span className="tw:text-body-s tw:text-foreground">{value}</span>
      </div>
    </div>
  );
}
