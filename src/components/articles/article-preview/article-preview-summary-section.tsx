import { Card, CardContent } from '@/components/ui/card';

type ArticlePreviewSummarySectionProps = Readonly<{
  summary?: string;
  isSkeleton?: boolean;
}>;

export function ArticlePreviewSummarySection({
  summary,
  isSkeleton = false,
}: ArticlePreviewSummarySectionProps) {
  const content = isSkeleton ? 'خلاصه مقاله' : summary?.trim();

  if (!content) return null;

  return (
    <section aria-label="خلاصه مقاله">
      <Card variant="filled" size="md">
        <CardContent>
          <p className="tw:text-body-s-italic tw:text-card-foreground md:tw:text-body-m-italic lg:tw:text-body-l-italic">
            {content}
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
