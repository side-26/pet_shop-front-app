import { Avatar, AvatarBadge, AvatarFallback } from '@/components/ui/avatar';

import { ShowcaseSection } from './showcase-section';

const sizes = ['sm', 'default', 'lg'] as const;

export function AvatarShowcase() {
  return (
    <ShowcaseSection
      id="avatars"
      title="Avatar"
      description="شناسه تصویری کاربر با اندازه‌های هماهنگ، جایگزین متنی و نشان وضعیت."
    >
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
        {sizes.map((size) => (
          <div key={size} className="tw:flex tw:flex-col tw:items-center tw:gap-2">
            <Avatar size={size}>
              <AvatarFallback>م</AvatarFallback>
              {size === 'lg' && <AvatarBadge aria-label="آنلاین" />}
            </Avatar>
            <span className="tw:text-label-s tw:text-muted-foreground">{size}</span>
          </div>
        ))}
      </div>
    </ShowcaseSection>
  );
}
