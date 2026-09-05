import {
  TipTap,
  TipTapHeaderActions,
  TipTapHeadingAction,
  TipTapImageUploadAction,
  TipTapListAction,
  TipTapTextAlignAction,
  TipTapTextDirectionAction,
} from '@/components/ui/tip-tap';

import { ShowcaseSection } from './showcase-section';

const initialContent = `
  <h2>راهنمای نگهداری</h2>
  <p>توضیحات تکمیلی درباره شرایط نگهداری حیوان را وارد کنید.</p>
  <ul><li>آب تازه در دسترس باشد.</li><li>محیط آرام و تمیز بماند.</li></ul>
  <blockquote>برای اطلاعات بیشتر با دامپزشک مشورت کنید.</blockquote>
`;
const variants = ['fill', 'tonal', 'outlined'] as const;
const colors = ['primary', 'secondary', 'success', 'error'] as const;
const textDirections = ['auto', 'rtl', 'ltr'] as const;

export function TipTapShowcase() {
  return (
    <ShowcaseSection
      id="tip-tap"
      title="TipTap"
      description="ویرایشگر متن پایه با خروجی HTML، تراز پاراگراف و جهت خودکار یا انتخابی؛ ابزارها و اتصال به فرم در مراحل بعدی افزوده می‌شوند."
    >
      <div className="tw:flex tw:flex-col tw:gap-6">
        {variants.map((variant) => (
          <section key={variant} className="tw:flex tw:flex-col tw:gap-3">
            <h4 className="tw:text-heading-4">حالت {variant}</h4>
            <div className="tw:grid tw:gap-3 tw:lg:grid-cols-2">
              {colors.map((color) => (
                <TipTap
                  key={color}
                  ariaLabel={`ویرایشگر ${color} با حالت ${variant}`}
                  color={color}
                  content={initialContent}
                  variant={variant}
                />
              ))}
            </div>
          </section>
        ))}

        <section className="tw:flex tw:flex-col tw:gap-3">
          <h4 className="tw:text-heading-4">جهت متن</h4>
          <div className="tw:grid tw:gap-3 tw:lg:grid-cols-3">
            {textDirections.map((textDirection) => (
              <TipTap
                key={textDirection}
                ariaLabel={`ویرایشگر با جهت ${textDirection}`}
                content={initialContent}
                textDirection={textDirection}
                variant="outlined"
              />
            ))}
          </div>
        </section>

        <section className="tw:flex tw:flex-col tw:gap-3">
          <h4 className="tw:text-heading-4">ابزارهای سرصفحه</h4>
          <TipTap
            ariaLabel="ویرایشگر با ابزارهای متن"
            content={initialContent}
            headerActions={
              <TipTapHeaderActions>
                <TipTapHeadingAction />
                <TipTapTextAlignAction />
                <TipTapTextDirectionAction />
                <TipTapListAction />
                <TipTapImageUploadAction />
              </TipTapHeaderActions>
            }
            variant="outlined"
          />
        </section>
      </div>
    </ShowcaseSection>
  );
}
