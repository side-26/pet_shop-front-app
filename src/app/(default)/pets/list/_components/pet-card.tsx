import { Heart, MapPin, Mars, Venus } from 'lucide-react';
import Image from 'next/image';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { cn } from '@/lib/utils';

import type { PetListItem } from './pet-list-data';

type PetCardProps = Readonly<{ pet: PetListItem; eager?: boolean }>;

export function PetCard({ pet, eager = false }: PetCardProps) {
  const SexIcon = pet.sex === 'نر' ? Mars : Venus;

  return (
    <Card
      size="xs"
      className={cn(
        'tw:h-full tw:transition-[transform,box-shadow] tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none',
        !pet.available && 'tw:bg-muted/45',
      )}
    >
      <div className="tw:relative tw:mx-2 tw:mt-2 tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:bg-muted tw:sm:mx-3 tw:sm:mt-3">
        <Image
          src={pet.image}
          alt={pet.imageAlt}
          fill
          loading={eager ? 'eager' : 'lazy'}
          sizes="(min-width: 1280px) 20vw, (min-width: 768px) 31vw, 94vw"
          className={cn(
            'tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/card:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none',
            !pet.available && 'tw:grayscale tw:opacity-60',
          )}
        />
        <Button
          iconOnly
          size="sm"
          variant="transparent"
          color="error"
          aria-label={`افزودن ${pet.name} به علاقه‌مندی‌ها`}
          className="tw:absolute tw:end-2 tw:top-2"
        >
          <Heart aria-hidden="true" />
        </Button>
        {!pet.available ? (
          <Badge color="warning" variant="tonal" className="tw:absolute tw:start-2 tw:bottom-2">
            واگذار شده
          </Badge>
        ) : null}
      </div>
      <CardHeader className="tw:gap-2">
        <div className="tw:flex tw:items-center tw:justify-between tw:gap-2">
          <CardTitle className="tw:text-title-l">{pet.name}</CardTitle>
          <Badge size="xs" variant="tonal" color="secondary">
            {pet.type}
          </Badge>
        </div>
        <p className="tw:text-body-s tw:text-muted-foreground">
          {pet.breed} • {pet.age}
        </p>
      </CardHeader>
      <CardContent className="tw:mt-auto tw:flex tw:flex-col tw:gap-3">
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-3 tw:text-label-s tw:text-muted-foreground">
          <span className="tw:inline-flex tw:items-center tw:gap-1">
            <SexIcon aria-hidden="true" />
            {pet.sex}
          </span>
          <span className="tw:inline-flex tw:items-center tw:gap-1">
            <MapPin aria-hidden="true" />
            {pet.location}
          </span>
        </div>
        <Price
          number={pet.price}
          prefix="تومان"
          className={cn(
            'tw:text-price-m tw:text-primary',
            !pet.available && 'tw:text-muted-foreground',
          )}
        />
      </CardContent>
      <CardFooter className="tw:mt-auto">
        <Button
          block
          size="sm"
          variant={pet.available ? 'tonal' : 'outlined'}
          color={pet.available ? 'primary' : 'secondary'}
          disabled={!pet.available}
        >
          {pet.available ? 'مشاهده جزئیات' : 'واگذار شده'}
        </Button>
      </CardFooter>
    </Card>
  );
}
