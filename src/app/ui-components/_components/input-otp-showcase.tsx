'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { InputOtpField } from '@/components/ui/fields/input-otp-field';
import { Form } from '@/components/ui/form';

import { ShowcaseSection } from './showcase-section';

const colors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;

type VerificationValues = {
  verificationCode: string;
};

export function InputOtpShowcase() {
  const [finishedCode, setFinishedCode] = useState<string>();
  const [submittedCode, setSubmittedCode] = useState<string>();

  return (
    <ShowcaseSection
      id="input-otp-fields"
      title="Input OTP Field"
      description="ورودی کد یک‌بارمصرف با رنگ و اندازه معنایی، اعتبارسنجی فرم، تکمیل خودکار و پشتیبانی کامل از راست‌به‌چپ."
    >
      <Form<VerificationValues>
        options={{ defaultValues: { verificationCode: '' } }}
        handleSubmit={(values) => setSubmittedCode(values.verificationCode)}
        className="tw:max-w-xl"
      >
        <InputOtpField<VerificationValues>
          name="verificationCode"
          label="کد تأیید"
          hint="کد شش‌رقمی پیامک‌شده را وارد کنید."
          rules={{
            required: 'کد تأیید الزامی است.',
            validate: (value) => value.length === 6 || 'کد تأیید باید شش رقم باشد.',
          }}
          color="info"
          size="lg"
          onFinished={setFinishedCode}
          submitOnFinished
        />
        <Button type="submit">بررسی کد</Button>
      </Form>
      <div className="tw:flex tw:flex-col tw:gap-1 tw:text-xs tw:text-muted-foreground">
        <p role="status">کد تکمیل‌شده: {finishedCode ?? '—'}</p>
        <p>کد ارسال‌شده از Form: {submittedCode ?? '—'}</p>
      </div>

      <Form<Record<string, string>> handleSubmit={() => undefined}>
        <div className="tw:flex tw:flex-col tw:gap-4">
          <h4 className="tw:text-heading-4">رنگ‌ها</h4>
          <div className="tw:grid tw:items-start tw:gap-4 tw:sm:grid-cols-2">
            {colors.map((color) => (
              <InputOtpField<Record<string, string>>
                key={color}
                name={`otp-color-${color}`}
                label={`رنگ ${color}`}
                hint="کد چهاررقمی"
                color={color}
                maxLength={4}
              />
            ))}
          </div>
        </div>

        <div className="tw:flex tw:flex-col tw:gap-4">
          <h4 className="tw:text-heading-4">اندازه‌ها</h4>
          <div className="tw:grid tw:items-start tw:gap-4 tw:sm:grid-cols-2">
            {sizes.map((size) => (
              <InputOtpField<Record<string, string>>
                key={size}
                name={`otp-size-${size}`}
                label={`اندازه ${size}`}
                hint="متن و خانه‌ها با اندازه هماهنگ می‌شوند."
                size={size}
                maxLength={4}
              />
            ))}
          </div>
        </div>

        <div className="tw:grid tw:items-start tw:gap-4 tw:sm:grid-cols-2">
          <InputOtpField<Record<string, string>>
            name="otp-disabled"
            label="غیرفعال"
            hint="امکان ورود کد وجود ندارد."
            disabled
            maxLength={4}
          />
          <InputOtpField<Record<string, string>>
            name="otp-readonly"
            label="فقط‌خواندنی"
            hint="کد قابل ویرایش نیست."
            readOnly
            maxLength={4}
          />
        </div>
      </Form>
    </ShowcaseSection>
  );
}
