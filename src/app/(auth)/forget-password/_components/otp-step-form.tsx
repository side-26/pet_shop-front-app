'use client';

import { useCallback, useState } from 'react';

import {
  otpStepSchema,
  type OtpStepValues,
} from '@/app/(auth)/forget-password/_components/forget-password.schemas';
import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/ui/countdown';
import { InputOtpField } from '@/components/ui/fields/input-otp-field';
import { Form } from '@/components/ui/form';
import type { SendOtpResponseDTO } from '@/entities/auth/auth.dto';
import { useResendOtp } from '@/entities/auth/auth.client';

type OtpStepFormProps = {
  phoneNumber: string;
  resendSeconds: number;
  onSubmit: (values: OtpStepValues) => void;
};

type CountdownState = {
  revision: number;
  seconds: number;
};

export function OtpStepForm({ phoneNumber, resendSeconds, onSubmit }: OtpStepFormProps) {
  const [countdown, setCountdown] = useState<CountdownState>({
    revision: 0,
    seconds: resendSeconds,
  });
  const handleResendSuccess = useCallback((response: SendOtpResponseDTO) => {
    setCountdown((current) => ({
      revision: current.revision + 1,
      seconds: response.remainingSeconds,
    }));
  }, []);
  const { handleResend, isLoading } = useResendOtp(phoneNumber, handleResendSuccess);

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
        key={countdown.revision}
        seconds={countdown.seconds}
        size="sm"
        color="primary"
        className="tw:justify-center"
      >
        <Button
          type="button"
          variant="text"
          color="primary"
          size="sm"
          onClick={handleResend}
          isLoading={isLoading}
          loadingText="در حال ارسال مجدد"
        >
          ارسال مجدد کد
        </Button>
      </Countdown>
    </Form>
  );
}
