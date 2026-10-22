import { HeartIcon, ShieldCheckIcon, SparklesIcon } from 'lucide-react';

import { FadeIn } from '@/components/common/animation/fade-in';
import {
  AnimatedStaggeredList,
  animatedStaggeredListItemClassName,
} from '@/components/common/staggered-list';

const principles = [
  {
    icon: ShieldCheckIcon,
    title: 'انتخاب‌های قابل اعتماد',
    description: 'هر محصول باید جواب روشنی برای نیاز واقعی حیوان شما داشته باشد.',
  },
  {
    icon: HeartIcon,
    title: 'مراقبت انسانی',
    description: 'با احترام به تفاوت‌های هر حیوان و سبک زندگی هر خانواده.',
  },
  {
    icon: SparklesIcon,
    title: 'تجربه‌ای ساده',
    description: 'از جست‌وجو تا دریافت سفارش، مسیر را روشن و بی‌دردسر نگه می‌داریم.',
  },
] as const;

export function AboutUsStory() {
  return (
    <section
      aria-labelledby="about-us-story-title"
      className="tw:rounded-t-[2.5rem] tw:bg-primary-muted/70 tw:py-12 tw:sm:rounded-t-[3.5rem] tw:sm:py-16 tw:lg:py-24"
    >
      <div className="tw:default-layout-container tw:grid tw:gap-10 tw:lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] tw:lg:gap-20">
        <div className="tw:flex tw:flex-col tw:gap-4">
          <span className="tw:text-label-l tw:font-bold tw:text-primary">قول ما به شما</span>
          <FadeIn loading="eager">
            <h2
              id="about-us-story-title"
              className="tw:max-w-xl tw:text-heading-1 tw:text-balance tw:sm:text-display-l"
            >
              مراقبت خوب، از <em className="tw:text-primary">شناختن</em> شروع می‌شود.
            </h2>
          </FadeIn>
        </div>

        <div className="tw:flex tw:flex-col tw:gap-8">
          <div className="tw:space-y-4 tw:text-body-m tw:leading-8 tw:text-foreground/80 tw:sm:text-body-l tw:sm:leading-9">
            <p>
              ما فقط یک فروشگاه نیستیم؛ همراهی هستیم برای لحظه‌هایی که درباره غذا، بهداشت، سرگرمی یا
              سلامت حیوان خانگی‌تان تصمیم می‌گیرید.
            </p>
            <p>
              هدف ما ساختن فضایی است که در آن اطلاعات روشن، محصولات باکیفیت و عشق به حیوانات در یک
              مسیر کنار هم قرار بگیرند.
            </p>
          </div>

          <AnimatedStaggeredList>
            <ul className="tw:grid tw:gap-3 tw:sm:grid-cols-3">
              {principles.map(({ description, icon: Icon, title }) => (
                <li key={title} className={animatedStaggeredListItemClassName}>
                  <div className="tw:flex tw:flex-col tw:gap-3 tw:rounded-2xl tw:border tw:border-primary/15 tw:bg-card/75 tw:p-4 tw:shadow-sm tw:sm:min-h-44">
                    <Icon aria-hidden="true" className="tw:size-5 tw:text-primary" />
                    <h3 className="tw:text-title-s">{title}</h3>
                    <p className="tw:text-body-s tw:leading-6 tw:text-muted-foreground">
                      {description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </AnimatedStaggeredList>
        </div>
      </div>
    </section>
  );
}
