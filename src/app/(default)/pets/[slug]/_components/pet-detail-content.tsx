import {
  CalendarDays,
  Check,
  Heart,
  MapPin,
  Mars,
  Palette,
  Scale,
  Share2,
  ShieldCheck,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Price } from '@/components/ui/price';
import { Separator } from '@/components/ui/separator';
import { routePaths } from '@/configs/route.path';
import { cn } from '@/lib/utils';

import type { PetDetail } from './pet-detail-data';
import { PetGallery } from './pet-gallery';

type PetDetailContentProps = Readonly<{ pet: PetDetail; isSkeleton?: boolean }>;

const infoItems = [
  { key: 'age', label: 'سن', icon: CalendarDays },
  { key: 'sex', label: 'جنسیت', icon: Mars },
  { key: 'color', label: 'رنگ', icon: Palette },
  { key: 'weight', label: 'وزن', icon: Scale },
] as const;

export function PetDetailContent({ pet, isSkeleton = false }: PetDetailContentProps) {
  return (
    <article
      aria-busy={isSkeleton || undefined}
      className={cn(
        'tw:mx-auto tw:w-full tw:max-w-7xl tw:pb-32 tw:lg:pb-14',
        isSkeleton && 'skeleton tw:pointer-events-none tw:select-none',
      )}
    >
      <div className="tw:px-4 tw:py-4 tw:sm:px-6 tw:lg:px-8 tw:lg:py-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={routePaths.home} />}>خانه</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href={routePaths.petsList} />}>حیوانات</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pet.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="tw:grid tw:gap-6 tw:lg:grid-cols-[minmax(0,1.05fr)_minmax(0,.95fr)] tw:lg:px-8">
        <PetGallery images={pet.images} />

        <div className="tw:flex tw:min-w-0 tw:flex-col tw:gap-5 tw:px-4 tw:sm:px-6 tw:lg:px-0">
          <div className="tw:flex tw:items-start tw:justify-between tw:gap-4">
            <div className="tw:min-w-0">
              <Badge color="success" variant="tonal" size="sm" className="tw:mb-3">
                <Check aria-hidden="true" /> {pet.status}
              </Badge>
              <h1 className="tw:text-heading-m tw:text-foreground tw:lg:text-heading-l">
                {pet.name}
              </h1>
              <p className="tw:mt-1 tw:text-title-s tw:text-muted-foreground">{pet.breed}</p>
            </div>
            <div className="tw:flex tw:gap-2">
              <Button
                iconOnly
                variant="outlined"
                color="secondary"
                aria-label={`اشتراک‌گذاری صفحه ${pet.name}`}
              >
                <Share2 aria-hidden="true" />
              </Button>
              <Button
                iconOnly
                variant="outlined"
                color="error"
                aria-label={`افزودن ${pet.name} به علاقه‌مندی‌ها`}
              >
                <Heart aria-hidden="true" />
              </Button>
            </div>
          </div>

          <div
            data-testid="breed-info"
            className="tw:grid tw:grid-cols-2 tw:gap-3 tw:md:grid-cols-4 tw:lg:grid-cols-2 tw:xl:grid-cols-4"
          >
            {infoItems.map(({ key, label, icon: Icon }) => (
              <Card key={key} size="xs" variant="filled" className="tw:rounded-2xl tw:bg-muted/55">
                <CardContent className="tw:flex tw:items-center tw:gap-2.5">
                  <span className="tw:flex tw:size-9 tw:shrink-0 tw:items-center tw:justify-center tw:rounded-xl tw:bg-primary-muted tw:text-primary">
                    <Icon aria-hidden="true" />
                  </span>
                  <div className="tw:min-w-0">
                    <p className="tw:text-label-s tw:text-muted-foreground">{label}</p>
                    <p className="tw:truncate tw:text-label-m">{pet[key]}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="tw:inline-flex tw:items-center tw:gap-2 tw:text-body-m tw:text-muted-foreground">
            <MapPin aria-hidden="true" />
            <span>{pet.location}</span>
          </div>
          <Separator />

          <section aria-labelledby="pet-description-title">
            <h2 id="pet-description-title" className="tw:text-title-m">
              درباره {pet.name}
            </h2>
            <p className="tw:mt-3 tw:text-body-m tw:leading-8 tw:text-muted-foreground">
              {pet.description}
            </p>
          </section>

          <Card size="sm" variant="outlined" className="tw:rounded-2xl">
            <CardHeader>
              <CardTitle>سلامت و مراقبت</CardTitle>
              <CardDescription>اطلاعات ثبت‌شده و تأییدشده برای {pet.name}</CardDescription>
            </CardHeader>
            <CardContent className="tw:grid tw:grid-cols-2 tw:gap-3 tw:text-label-m">
              <span className="tw:inline-flex tw:items-center tw:gap-2">
                <ShieldCheck aria-hidden="true" className="tw:text-success" />
                واکسیناسیون کامل
              </span>
              <span className="tw:inline-flex tw:items-center tw:gap-2">
                <Stethoscope aria-hidden="true" className="tw:text-info" />
                معاینه دامپزشک
              </span>
            </CardContent>
          </Card>

          <Card
            size="sm"
            variant="filled"
            className="tw:hidden tw:rounded-2xl tw:bg-primary-muted/45 tw:lg:flex"
          >
            <CardContent className="tw:flex tw:items-end tw:justify-between tw:gap-4">
              <div>
                <p className="tw:mb-1 tw:text-label-s tw:text-muted-foreground">هزینه واگذاری</p>
                <Price
                  number={pet.price}
                  prefix="تومان"
                  className="tw:text-price-l tw:text-primary"
                />
              </div>
              <Button size="xl">درخواست واگذاری</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card
        size="xs"
        variant="glass"
        className="tw:fixed tw:inset-x-4 tw:bottom-20 tw:z-30 tw:rounded-2xl tw:py-3 tw:sm:inset-x-6 tw:sm:bottom-28 tw:lg:hidden"
      >
        <CardFooter className="tw:flex-nowrap tw:justify-between">
          <Price number={pet.price} prefix="تومان" className="tw:text-price-s tw:text-primary" />
          <Button size="lg" className="tw:flex-1">
            درخواست واگذاری
          </Button>
        </CardFooter>
      </Card>
    </article>
  );
}
