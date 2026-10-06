import { ProfileOrdersEmpty } from './profile-orders-empty';
import { ProfileOrdersFetchError } from './profile-orders-fetch-error';

type Props = Readonly<{ errorMessage?: string }>;

export function ProfileOrdersState({ errorMessage }: Props) {
  return (
    <section aria-labelledby="orders-heading" className="tw:flex tw:flex-col tw:gap-4">
      <div className="tw:flex tw:flex-col tw:gap-1">
        <h2 id="orders-heading" className="tw:text-title-l">
          سفارش‌های من
        </h2>
        <p className="tw:text-body-m tw:text-muted-foreground">
          وضعیت سفارش‌ها را ببینید و جزئیات ارسال را بررسی کنید.
        </p>
      </div>
      {errorMessage ? (
        <ProfileOrdersFetchError description={errorMessage} />
      ) : (
        <ProfileOrdersEmpty />
      )}
    </section>
  );
}
