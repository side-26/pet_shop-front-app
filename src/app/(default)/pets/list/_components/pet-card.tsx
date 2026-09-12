import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

export type PetCardViewModel = {
  available: boolean;
  breed: string;
  discountPercentage: number;
  id: string;
  image: string;
  imageThumbnail: string;
  petType: string;
  price: number;
  slug: string;
  title: string;
};

type PetCardProps = Readonly<{ eager?: boolean; isSkeleton?: boolean; pet: PetCardViewModel }>;

export function PetCard({ eager = false, isSkeleton = false, pet }: PetCardProps) {
  const hasDiscount = pet.discountPercentage > 0;
  const discountedPrice = pet.price * (1 - pet.discountPercentage / 100);

  return (
    <Card
      size="xs"
      className={cn(
        'tw:h-full tw:transition-[transform,box-shadow] tw:duration-300 tw:hover:-translate-y-1 tw:hover:shadow-xl tw:motion-reduce:transition-none tw:motion-reduce:hover:transform-none',
        !pet.available && 'tw:bg-muted/45',
      )}
    >
      <div className="tw:relative tw:mx-2 tw:mt-2 tw:aspect-[4/3] tw:overflow-hidden tw:rounded-2xl tw:bg-muted tw:sm:mx-3 tw:sm:mt-3">
        {isSkeleton ? (
          <div className="tw:absolute tw:inset-0" />
        ) : (
          <Image
            src={pet.image}
            alt={pet.title}
            fill
            loading={eager ? 'eager' : 'lazy'}
            placeholder={pet.imageThumbnail ? 'blur' : 'empty'}
            blurDataURL={pet.imageThumbnail}
            sizes="(min-width: 1280px) 20vw, (min-width: 768px) 31vw, 94vw"
            className={cn(
              'tw:object-cover tw:transition-transform tw:duration-500 tw:group-hover/card:scale-105 tw:motion-reduce:transition-none tw:motion-reduce:group-hover/card:transform-none',
              !pet.available && 'tw:grayscale tw:opacity-60',
            )}
          />
        )}
        <Button
          iconOnly
          size="sm"
          variant="transparent"
          color="error"
          disabled={isSkeleton}
          aria-label={`افزودن ${pet.title} به علاقه‌مندی‌ها`}
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
          <CardTitle className="tw:text-title-l">{pet.title}</CardTitle>
          <Badge size="xs" variant="tonal" color="secondary">
            {pet.petType}
          </Badge>
        </div>
        <p className="tw:text-body-s tw:text-muted-foreground">{pet.breed}</p>
      </CardHeader>
      <CardContent className="tw:mt-auto tw:flex tw:flex-col tw:items-end tw:gap-1">
        {hasDiscount ? (
          <Price
            number={pet.price}
            className="tw:text-label-s tw:text-muted-foreground tw:line-through"
          />
        ) : null}
        <Price
          number={hasDiscount ? discountedPrice : pet.price}
          className={cn(
            'tw:text-price-m tw:text-primary',
            !pet.available && 'tw:text-muted-foreground',
          )}
        />
      </CardContent>
      <CardFooter className="tw:mt-auto">
        {pet.available && !isSkeleton ? (
          <Link
            href={routePaths.petDetail(pet.slug)}
            prefetch
            className={buttonVariants({
              block: true,
              color: 'primary',
              size: 'sm',
              variant: 'tonal',
            })}
          >
            مشاهده جزئیات
          </Link>
        ) : (
          <Button block size="sm" variant="outlined" color="secondary" disabled>
            {isSkeleton ? 'مشاهده جزئیات' : 'واگذار شده'}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
