'use client';

import { AlertTriangle } from 'lucide-react';

import { ConfirmDialog } from '@/components/common/confirm-dialog/main';
import { Button } from '@/components/ui/button';
import { useCommonStore } from '@/stores/common.store';

import { ShowcaseSection } from './showcase-section';

export function ConfirmDialogShowcase() {
  const showConfirmDialog = useCommonStore((state) => state.showConfirmDialog);

  return (
    <ShowcaseSection
      id="confirm-dialogs"
      title="Confirm Dialog"
      description="لایهٔ سراسری تأیید عملیات که از فروشگاه مشترک کنترل می‌شود و هنگام انجام درخواست، از ارسال دوباره جلوگیری می‌کند."
    >
      <div className="tw:flex tw:flex-wrap tw:gap-3">
        <Button
          color="warning"
          variant="outlined"
          onClick={() => {
            showConfirmDialog({
              title: 'سفارش لغو شود؟',
              message: 'این درخواست به‌صورت نمونه ثبت نمی‌شود و فقط رفتار گفت‌وگو را نمایش می‌دهد.',
              icon: AlertTriangle,
              onSuccess: async () => undefined,
            });
          }}
        >
          نمایش گفت‌وگوی تأیید
        </Button>
      </div>
      <ConfirmDialog />
    </ShowcaseSection>
  );
}
