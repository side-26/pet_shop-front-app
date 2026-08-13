import { BadgeShowcase } from './badge-showcase';
import { ButtonShowcase } from './button-showcase';
import { CardShowcase } from './card-showcase';
import { AlertDialogShowcase } from './alert-dialog-showcase';
import { PopoverShowcase } from './popover-showcase';
import { SpinnerShowcase } from './spinner-showcase';
import { TooltipShowcase } from './tooltip-showcase';
import { CollapsibleShowcase } from './collapsible-showcase';
import { DialogShowcase } from './dialog-showcase';
import { ToastShowcase } from './toast-showcase';
import { DropdownMenuShowcase } from './dropdown-menu-showcase';
import { PaginationShowcase } from './pagination-showcase';
import { ButtonGroupShowcase } from './button-group-showcase';
import { CarouselShowcase } from './carousel-showcase';
import { DataTableShowcase } from './data-table-showcase';
import { MenubarShowcase } from './menubar-showcase';

const navigation = [
  ['#buttons', 'Button'],
  ['#badges', 'Badge'],
  ['#cards', 'Card'],
  ['#alert-dialogs', 'Alert Dialog'],
  ['#popovers', 'Popover'],
  ['#tooltips', 'Tooltip'],
  ['#spinners', 'Spinner'],
  ['#dialogs', 'Dialog'],
  ['#toasts', 'Toast'],
  ['#collapsibles', 'Collapsible'],
  ['#dropdown-menus', 'Dropdown Menu'],
  ['#paginations', 'Pagination'],
  ['#data-tables', 'Data Table'],
  ['#carousels', 'Carousel'],
  ['#button-groups', 'Button Group'],
  ['#menubars', 'Menubar'],
] as const;

export function UiComponentsGallery() {
  return (
    <main className="tw:min-h-full tw:bg-background tw:text-foreground">
      <div className="tw:mx-auto tw:flex tw:w-full tw:max-w-7xl tw:flex-col tw:gap-8 tw:px-4 tw:py-10 tw:sm:px-6 tw:lg:px-8 tw:lg:py-16">
        <header className="tw:flex tw:flex-col tw:gap-5">
          <div className="tw:flex tw:max-w-3xl tw:flex-col tw:gap-3">
            <p className="tw:text-label-m tw:text-primary">Pet Shop UI · macOS 27</p>
            <h1 className="tw:text-heading-1">کتابخانه اجزای رابط کاربری</h1>
            <p className="tw:text-body-l tw:text-muted-foreground">
              مرجع زنده اجزای عمومی پت‌شاپ، شامل اندازه‌ها، ظاهرها، رنگ‌های معنایی و حالت‌های تعاملی
              پشتیبانی‌شده.
            </p>
          </div>

          <nav aria-label="فهرست اجزای رابط کاربری">
            <ul className="tw:flex tw:flex-wrap tw:gap-2">
              {navigation.map(([href, label]) => (
                <li key={href}>
                  <a
                    href={href}
                    className="tw:inline-flex tw:rounded-full tw:border tw:border-border tw:bg-card tw:px-4 tw:py-2 tw:text-label-m tw:text-card-foreground tw:transition-colors tw:hover:bg-muted tw:focus-visible:outline-none tw:focus-visible:ring-3 tw:focus-visible:ring-ring/30"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <ButtonShowcase />
        <BadgeShowcase />
        <CardShowcase />
        <AlertDialogShowcase />
        <PopoverShowcase />
        <TooltipShowcase />
        <SpinnerShowcase />
        <DialogShowcase />
        <ToastShowcase />
        <CollapsibleShowcase />
        <DropdownMenuShowcase />
        <PaginationShowcase />
        <DataTableShowcase />
        <CarouselShowcase />
        <ButtonGroupShowcase />
        <MenubarShowcase />
      </div>
    </main>
  );
}
