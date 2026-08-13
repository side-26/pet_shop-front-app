import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { ShowcaseSection } from './showcase-section';

export function CarouselShowcase() {
  return (
    <ShowcaseSection
      id="carousels"
      title="Carousel"
      description="کاروسل Embla با جهت واقعی RTL، ناوبری صفحه‌کلید معکوس‌شده و فلش‌های هماهنگ با معنای قبلی/بعدی."
    >
      <Carousel aria-label="پیشنهادهای پت‌شاپ" className="tw:mx-auto tw:w-full tw:max-w-3xl">
        <CarouselContent>
          {[1, 2, 3, 4].map((item) => (
            <CarouselItem key={item} className="tw:md:basis-1/2">
              <Card variant="outlined">
                <CardContent className="tw:flex tw:aspect-video tw:items-center tw:justify-center tw:text-heading-2">
                  پیشنهاد {item}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="tw:start-2" />
        <CarouselNext className="tw:end-2" />
      </Carousel>
    </ShowcaseSection>
  );
}
