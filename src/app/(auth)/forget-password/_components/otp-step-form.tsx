'use client';

import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Countdown } from '@/components/ui/countdown';
import { InputOtpField } from '@/components/ui/fields/input-otp-field';
import { Form } from '@/components/ui/form';
import type { SendOtpResponseDTO } from '@/entities/auth/auth.dto';
import { useResendOtp, useVerifyResetPasswordOtp } from '@/entities/auth/auth.client';
import { verifyOtpCodeSchema, type VerifyOtpCodeInput } from '@/entities/auth/auth.schema';

type OtpStepFormProps = {
  phoneNumber: string;
  resendSeconds: number;
  onSuccess: () => void;
};

type CountdownState = {
  revision: number;
  seconds: number;
};

export function OtpStepForm({ phoneNumber, resendSeconds, onSuccess }: OtpStepFormProps) {
  const [countdown, setCountdown] = useState<CountdownState>({
    revision: 0,
    seconds: resendSeconds,
  });
  const { formRef, handleFinished, handleSubmit, resetVerificationCode } =
    useVerifyResetPasswordOtp(phoneNumber, onSuccess);
  const handleResendSuccess = useCallback(
    (response: SendOtpResponseDTO) => {
      resetVerificationCode();
      setCountdown((current) => ({
        revision: current.revision + 1,
        seconds: response.remainingSeconds,
      }));
    },
    [resetVerificationCode],
  );
  const { handleResend, isLoading } = useResendOtp(phoneNumber, handleResendSuccess);

  return (
    <Form<VerifyOtpCodeInput>
      ref={formRef}
      validationSchema={verifyOtpCodeSchema}
      options={{ defaultValues: { verificationCode: '' }, shouldFocusError: false }}
      handleSubmit={handleSubmit}
      aria-label="فرم کد تأیید بازیابی کلمه عبور"
      className="tw:items-center tw:gap-3"
    >
      {({ formState: { isSubmitting } }) => (
        <>
          <InputOtpField<VerifyOtpCodeInput>
            name="verificationCode"
            label="کد تأیید"
            hint={isSubmitting ? 'در حال بررسی کد تأیید…' : 'کد ۶ رقمی ارسال‌شده را وارد کنید.'}
            maxLength={6}
            focusOnMount
            onFinished={handleFinished}
            disabled={isSubmitting}
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
        </>
      )}
    </Form>
  );
}
