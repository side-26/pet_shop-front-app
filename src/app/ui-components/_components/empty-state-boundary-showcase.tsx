import { EmptyStateBoundary, EmptyStateBoundaryClient } from '@/components/ui/empty-state-boundary';
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from '@/components/ui/empty';

import { ShowcaseSection } from './showcase-section';

function EmptyArticlesFallback() {
  return (
    <Empty className="tw:border">
      <EmptyHeader>
        <EmptyTitle>مقاله‌ای برای نمایش وجود ندارد</EmptyTitle>
        <EmptyDescription>
          پس از ایجاد مقاله، فهرست آن در این بخش نمایش داده می‌شود.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function EmptyStateBoundaryShowcase() {
  return (
    <ShowcaseSection
      id="empty-state-boundaries"
      title="Empty State Boundary"
      description="نمایش جایگزین برای داده‌های آرایه‌ای خالی در کامپوننت‌های سرور و کلاینت."
    >
      <div className="tw:grid tw:gap-6 tw:md:grid-cols-2">
        <EmptyStateBoundary data={[]} fallback={<EmptyArticlesFallback />}>
          <p>فهرست مقاله‌ها</p>
        </EmptyStateBoundary>
        <EmptyStateBoundaryClient data={['article']} fallback={<EmptyArticlesFallback />}>
          <p>فهرست مقاله‌ها در نسخهٔ کلاینت</p>
        </EmptyStateBoundaryClient>
      </div>
    </ShowcaseSection>
  );
}
