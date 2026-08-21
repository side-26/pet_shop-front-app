'use client';

import { PhoneIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import type { SendOtpResponseDTO } from '@/entities/auth/auth.dto';
import { useSendOtp } from '@/entities/auth/auth.client';
import { sendOtpSchema, type SendOtpInput } from '@/entities/auth/auth.schema';

type PhoneStepFormProps = {
  defaultPhoneNumber: string;
  onSuccess: (input: SendOtpInput, response: SendOtpResponseDTO) => void;
};

const mixedDirectionInput =
  'tw:text-left tw:[&::placeholder]:text-right tw:[&::placeholder]:[direction:rtl]';

export function PhoneStepForm({ defaultPhoneNumber, onSuccess }: PhoneStepFormProps) {
  const { formRef, handleSubmit } = useSendOtp(onSuccess);

  return (
    <Form<SendOtpInput>
      ref={formRef}
      validationSchema={sendOtpSchema}
      options={{ defaultValues: { phoneNumber: defaultPhoneNumber }, mode: 'onBlur' }}
      handleSubmit={handleSubmit}
      aria-label="فرم شماره موبایل بازیابی کلمه عبور"
      className="tw:mx-auto tw:max-w-sm tw:gap-3"
    >
      {(formMethods) => (
        <>
          <TextField<SendOtpInput>
            name="phoneNumber"
            label="شماره موبایل"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            autoFocus
            dir="ltr"
            size="lg"
            color="primary"
            placeholder="شماره موبایل"
            prefixIcon={<PhoneIcon />}
            className={mixedDirectionInput}
          />

          <Button
            type="submit"
            size="lg"
            color="primary"
            block
            isLoading={formMethods.formState.isSubmitting}
            loadingText="در حال ارسال کد"
          >
            ارسال کد تأیید
          </Button>
        </>
      )}
    </Form>
  );
}
