import { MobilePetTools } from './mobile-pet-tools';
import { PetFilters } from './pet-filters';
import { PetGrid } from './pet-grid';
import { PetListBreadcrumb } from './pet-list-breadcrumb';

export function PetListContent() {
  return (
    <main className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-5 tw:px-3 tw:py-5 tw:sm:px-5 tw:md:gap-6 tw:md:px-6 tw:md:py-8 tw:lg:px-8 tw:lg:py-10">
      <PetListBreadcrumb />
      <header className="tw:flex tw:flex-col tw:gap-2">
        <h1 className="tw:text-heading-2 tw:lg:text-heading-1">حیوانات دوست‌داشتنی</h1>
        <p className="tw:max-w-2xl tw:text-body-m tw:text-muted-foreground">
          همراه تازه خانواده‌تان را از میان حیوانات سالم و آماده واگذاری پیدا کنید.
        </p>
      </header>
      <MobilePetTools />
      <div className="tw:grid tw:items-start tw:gap-6 tw:lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="tw:sticky tw:top-28 tw:hidden tw:lg:block" aria-label="فیلتر حیوانات">
          <PetFilters />
        </aside>
        <PetGrid />
      </div>
    </main>
  );
}
