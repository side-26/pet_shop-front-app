'use client';

import { useRef } from 'react';

import {
  otpStepSchema,
  type OtpStepValues,
} from '@/app/(auth)/forget-password/_components/forget-password.schemas';
import { Button } from '@/components/ui/button';
import { Countdown, type CountdownRef } from '@/components/ui/countdown';
import { InputOtpField } from '@/components/ui/fields/input-otp-field';
import { Form } from '@/components/ui/form';

type OtpStepFormProps = {
  resendSeconds: number;
  onSubmit: (values: OtpStepValues) => void;
};

export function OtpStepForm({ resendSeconds, onSubmit }: OtpStepFormProps) {
  const countdownRef = useRef<CountdownRef>(null);

  return (
    <Form<OtpStepValues>
      validationSchema={otpStepSchema}
      options={{ defaultValues: { verificationCode: '' }, shouldFocusError: false }}
      handleSubmit={onSubmit}
      aria-label="فرم کد تأیید بازیابی کلمه عبور"
      className="tw:items-center tw:gap-3"
    >
      <InputOtpField<OtpStepValues>
        name="verificationCode"
        label="کد تأیید"
        hint="کد ۶ رقمی ارسال‌شده را وارد کنید."
        maxLength={6}
        focusOnMount
        submitOnFinished
        className="tw:items-center tw:text-center"
      />

      <Countdown
        ref={countdownRef}
        seconds={resendSeconds}
        size="sm"
        color="primary"
        className="tw:justify-center"
      >
        <Button
          type="button"
          variant="text"
          color="primary"
          size="sm"
          onClick={() => countdownRef.current?.reset()}
        >
          ارسال مجدد کد
        </Button>
      </Countdown>
    </Form>
  );
}
