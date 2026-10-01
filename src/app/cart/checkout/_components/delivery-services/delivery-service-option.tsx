'use client';

import { CalendarClock, ChevronDown, PackageCheck, Route } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { FieldLabel } from '@/components/ui/field/label';
import { RadioGroupItem } from '@/components/ui/fields/radio-group';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils';

import { DeliveryServiceDetailItem } from './delivery-service-detail-item';
import type { CheckoutDeliveryServiceViewModel } from './delivery-services.types';

type DeliveryServiceOptionProps = Readonly<{
  isSelected: boolean;
  isSkeleton?: boolean;
  service: CheckoutDeliveryServiceViewModel;
}>;

function getServiceName(service: CheckoutDeliveryServiceViewModel) {
  return service.title_fa || service.title;
}

export function DeliveryServiceOption({
  isSelected,
  isSkeleton = false,
  service,
}: DeliveryServiceOptionProps) {
  const serviceName = getServiceName(service);
  const [isOpen, setIsOpen] = useState(isSelected);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className={cn(
        'tw:overflow-hidden tw:rounded-2xl tw:border tw:transition-[background-color,border-color,box-shadow] tw:duration-200 tw:motion-reduce:transition-none',
        isSelected
          ? 'tw:border-primary/45 tw:bg-primary-muted/70 tw:shadow-lg tw:shadow-primary/10 tw:supports-backdrop-filter:backdrop-blur-xl'
          : 'tw:border-border tw:bg-card',
      )}
    >
      <div className="tw:flex tw:min-h-14 tw:items-center tw:justify-between tw:gap-3 tw:p-3">
        <RadioGroupItem
          id={`delivery-service-${service.id}`}
          value={service.id}
          disabled={isSkeleton}
        />
        <FieldLabel
          htmlFor={`delivery-service-${service.id}`}
          className="tw:min-w-0 tw:flex-1 tw:cursor-pointer tw:items-center tw:gap-3"
        >
          <Avatar aria-hidden="true" size="lg">
            {service.logo ? <AvatarImage src={service.logo} alt={serviceName} /> : null}
            <AvatarFallback>{serviceName.slice(0, 1)}</AvatarFallback>
          </Avatar>
          <span className="tw:min-w-0 tw:truncate tw:text-title-s tw:text-foreground">
            {serviceName}
          </span>
        </FieldLabel>
        <CollapsibleTrigger
          aria-label={`نمایش جزئیات ${serviceName}`}
          disabled={isSkeleton}
          className="tw:group/delivery-service tw:flex tw:size-10 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-ring/25 tw:disabled:cursor-default"
        >
          <ChevronDown
            aria-hidden="true"
            className="tw:size-5 tw:text-muted-foreground tw:transition-transform tw:group-aria-expanded/delivery-service:rotate-180 tw:motion-reduce:transition-none"
          />
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent>
        <div className="tw:flex tw:flex-col tw:gap-3 tw:border-t tw:border-border/70 tw:p-3">
          <div className="tw:flex tw:flex-wrap tw:gap-2 tw:lg:grid tw:lg:grid-cols-3">
            <DeliveryServiceDetailItem
              icon={Route}
              label="هزینه مسیر"
              value={<Price number={service.calculatedPricePerKilometer} />}
            />
            <DeliveryServiceDetailItem
              icon={PackageCheck}
              label="بسته‌بندی"
              value={<Price number={service.packingPrice} />}
            />
            <DeliveryServiceDetailItem
              icon={CalendarClock}
              label="بازه"
              value={`${service.availability.length.toLocaleString('fa-IR')} بازه`}
            />
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
