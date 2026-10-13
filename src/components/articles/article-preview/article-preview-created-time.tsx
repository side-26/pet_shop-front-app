type ArticlePreviewCreatedTimeProps = Readonly<{
  createdAt?: string;
}>;

function formatJalaliTime(value?: string) {
  if (!value) return '—';

  return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function ArticlePreviewCreatedTime({ createdAt }: ArticlePreviewCreatedTimeProps) {
  return (
    <time dateTime={createdAt} className="tw:text-body-s tw:text-muted-foreground">
      {formatJalaliTime(createdAt)}
    </time>
  );
}
