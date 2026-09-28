import { FitText } from '@/components/ui/fit-text';

import { ShowcaseSection } from './showcase-section';

export function FitTextShowcase() {
  return (
    <ShowcaseSection
      id="fit-text"
      title="Fit Text"
      description="متن در عرض ثابت، به‌صورت خودکار از سطح‌های تایپوگرافی کوچک‌تر استفاده می‌کند و در کوچک‌ترین سطح، در صورت نیاز کوتاه می‌شود."
    >
      <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
        <div className="tw:w-72 tw:rounded-xl tw:bg-muted tw:px-3 tw:py-2">
          <FitText as="p" variant="body">
            غذای خشک سگ مدل رویال کنین با نام بسیار طولانی
          </FitText>
        </div>
        <div className="tw:w-40 tw:rounded-xl tw:bg-muted tw:px-3 tw:py-2">
          <FitText as="p" variant="title">
            غذای خشک سگ مدل رویال کنین با نام بسیار طولانی
          </FitText>
        </div>
        <div className="tw:w-24 tw:rounded-xl tw:bg-muted tw:px-3 tw:py-2">
          <FitText as="p" variant="title">
            غذای خشک سگ مدل رویال کنین با نام بسیار طولانی
          </FitText>
        </div>
      </div>
    </ShowcaseSection>
  );
}
