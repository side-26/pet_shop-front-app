'use client';

import { PhoneIcon } from 'lucide-react';

import {
  phoneStepSchema,
  type PhoneStepValues,
} from '@/app/(auth)/forget-password/_components/forget-password.schemas';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';

type PhoneStepFormProps = {
  defaultPhoneNumber: string;
  onSubmit: (values: PhoneStepValues) => void;
};

const mixedDirectionInput =
  'tw:text-left tw:[&::placeholder]:text-right tw:[&::placeholder]:[direction:rtl]';

export function PhoneStepForm({ defaultPhoneNumber, onSubmit }: PhoneStepFormProps) {
  return (
    <Form<PhoneStepValues>
      validationSchema={phoneStepSchema}
      options={{ defaultValues: { phoneNumber: defaultPhoneNumber }, mode: 'onBlur' }}
      handleSubmit={onSubmit}
      aria-label="فرم شماره موبایل بازیابی کلمه عبور"
      className="tw:mx-auto tw:max-w-sm tw:gap-3"
    >
      <TextField<PhoneStepValues>
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

      <Button type="submit" size="lg" color="primary" className="tw:w-full">
        ارسال کد تأیید
      </Button>
    </Form>
  );
}
