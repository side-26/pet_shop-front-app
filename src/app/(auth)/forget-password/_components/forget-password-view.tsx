'use client';

import { useCallback, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

import { AuthCardShell } from '@/app/(auth)/_components/auth-form-card';
import { OtpStepForm } from '@/app/(auth)/forget-password/_components/otp-step-form';
import { PasswordStepForm } from '@/app/(auth)/forget-password/_components/password-step-form';
import { PhoneStepForm } from '@/app/(auth)/forget-password/_components/phone-step-form';
import type { OtpStepValues } from '@/app/(auth)/forget-password/_components/forget-password.schemas';
import { Button } from '@/components/ui/button';
import { CardContent, CardFooter } from '@/components/ui/card';
import type { SendOtpResponseDTO } from '@/entities/auth/auth.dto';
import type { SendOtpInput } from '@/entities/auth/auth.schema';
import { cn } from '@/lib/utils';

type RecoveryStep = 1 | 2 | 3;
type NavigationDirection = 1 | -1;

type ForgetPasswordViewProps = {
  resendSeconds?: number;
};

type StepHeaderProps = {
  title: string;
  children: ReactNode;
};

const steps = [1, 2, 3] as const;

function StepHeader({ title, children }: StepHeaderProps) {
  return (
    <header className="tw:flex tw:flex-col tw:gap-1 tw:text-center">
      <h1 id="forget-password-title" className="tw:text-heading-3 tw:text-card-foreground">
        {title}
      </h1>
      <div className="tw:text-body-s tw:text-muted-foreground">{children}</div>
    </header>
  );
}

export function ForgetPasswordView({ resendSeconds = 60 }: ForgetPasswordViewProps) {
  const [step, setStep] = useState<RecoveryStep>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCountdownSeconds, setOtpCountdownSeconds] = useState(resendSeconds);
  const [navigationDirection, setNavigationDirection] = useState<NavigationDirection>(1);
  const reduceMotion = Boolean(useReducedMotion());

  const handlePhoneSuccess = useCallback((input: SendOtpInput, response: SendOtpResponseDTO) => {
    setPhoneNumber(input.phoneNumber);
    setOtpCountdownSeconds(response.remainingSeconds);
    setNavigationDirection(1);
    setStep(2);
  }, []);

  const handlePhoneChange = useCallback(() => {
    setNavigationDirection(-1);
    setStep(1);
  }, []);

  const handleOtpSubmit = useCallback((_values: OtpStepValues) => {
    setNavigationDirection(1);
    setStep(3);
  }, []);

  const slideDistance = reduceMotion ? 0 : navigationDirection === 1 ? '28%' : '-28%';
  const exitDistance = reduceMotion ? 0 : navigationDirection === 1 ? '-28%' : '28%';

  return (
    <AuthCardShell titleId="forget-password-title">
      <CardContent className="tw:overflow-hidden tw:sm:max-lg:mx-auto tw:sm:max-lg:w-full tw:sm:max-lg:max-w-[430px]">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            data-step={step}
            initial={{ x: slideDistance, opacity: reduceMotion ? 1 : 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: exitDistance, opacity: reduceMotion ? 1 : 0 }}
            transition={
              reduceMotion ? { duration: 0 } : { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
            }
            className="tw:flex tw:flex-col tw:gap-4"
          >
            {step === 1 && (
              <>
                <StepHeader title="فراموشی کلمه عبور">
                  شماره موبایل خود را وارد کنید تا کد تأیید برای شما ارسال شود.
                </StepHeader>
                <PhoneStepForm defaultPhoneNumber={phoneNumber} onSuccess={handlePhoneSuccess} />
              </>
            )}

            {step === 2 && (
              <>
                <StepHeader title="فراموشی کلمه عبور">
                  کد تأیید به شماره{' '}
                  <bdi dir="ltr" className="tw:font-medium tw:text-foreground">
                    {phoneNumber}
                  </bdi>{' '}
                  ارسال شد.
                  <Button
                    type="button"
                    variant="text"
                    color="primary"
                    size="xs"
                    onClick={handlePhoneChange}
                  >
                    تغییر شماره
                  </Button>
                </StepHeader>
                <OtpStepForm
                  phoneNumber={phoneNumber}
                  resendSeconds={otpCountdownSeconds}
                  onSubmit={handleOtpSubmit}
                />
              </>
            )}

            {step === 3 && (
              <>
                <StepHeader title="تنظیم کلمه عبور جدید">
                  کلمه عبور جدید را وارد و دوباره تأیید کنید.
                </StepHeader>
                <PasswordStepForm />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </CardContent>

      <CardFooter className="tw:justify-center tw:border-t tw:border-border/70 tw:text-center tw:sm:max-lg:mx-auto tw:sm:max-lg:w-full tw:sm:max-lg:max-w-[430px] tw:[@media(max-height:430px)]:pt-1.5">
        <div className="tw:flex tw:items-center tw:gap-3" aria-label={`مرحله ${step} از ۳`}>
          <ol aria-hidden="true" className="tw:flex tw:items-center tw:gap-1.5">
            {steps.map((item) => (
              <li
                key={item}
                className={cn(
                  'tw:h-1.5 tw:rounded-full tw:transition-[width,background-color] tw:motion-reduce:transition-none',
                  item === step ? 'tw:w-5 tw:bg-primary' : 'tw:w-1.5 tw:bg-muted-foreground/35',
                )}
              />
            ))}
          </ol>
          <span className="tw:text-label-s tw:text-muted-foreground">مرحله {step} از ۳</span>
        </div>
      </CardFooter>
    </AuthCardShell>
  );
}
