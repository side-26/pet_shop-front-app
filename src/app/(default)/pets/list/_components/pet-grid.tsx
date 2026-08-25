import { Button } from '@/components/ui/button';
import { ListingSortToolbar } from '@/components/common/listing-sort-toolbar';

import { PetCard } from './pet-card';
import { petListItems } from './pet-list-data';

const sortOptions = ['پیشنهاد ویژه', 'جدیدترین', 'کم‌سن‌ترین', 'ارزان‌ترین'] as const;

export function PetGrid() {
  return (
    <section
      aria-labelledby="pets-grid-heading"
      className="tw:flex tw:min-w-0 tw:flex-col tw:gap-5"
    >
      <ListingSortToolbar options={sortOptions} />
      <h2 id="pets-grid-heading" className="tw:sr-only">
        فهرست حیوانات
      </h2>
      <div
        data-testid="pets-grid"
        className="tw:grid tw:grid-cols-1 tw:gap-4 tw:md:grid-cols-3 tw:xl:grid-cols-4 tw:xl:gap-5"
      >
        {petListItems.map((pet, index) => (
          <PetCard key={pet.id} pet={pet} eager={index === 0} />
        ))}
      </div>
      <Button size="lg" variant="outlined" className="tw:self-center tw:px-10">
        مشاهده حیوانات بیشتر
      </Button>
    </section>
  );
}
