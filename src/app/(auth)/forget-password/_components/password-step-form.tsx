'use client';

import { LockKeyholeIcon } from 'lucide-react';

import {
  passwordStepSchema,
  type PasswordStepValues,
} from '@/app/(auth)/forget-password/_components/forget-password.schemas';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';

const mixedDirectionInput =
  'tw:text-left tw:[&::placeholder]:text-right tw:[&::placeholder]:[direction:rtl]';

export function PasswordStepForm() {
  return (
    <Form<PasswordStepValues>
      validationSchema={passwordStepSchema}
      options={{
        defaultValues: { newPassword: '', confirmPassword: '' },
        mode: 'onBlur',
      }}
      handleSubmit={() => undefined}
      aria-label="فرم تنظیم کلمه عبور جدید"
      className="tw:gap-3"
    >
      <TextField<PasswordStepValues>
        name="newPassword"
        label="کلمه عبور جدید"
        type="password"
        autoComplete="new-password"
        autoFocus
        dir="ltr"
        size="lg"
        color="primary"
        placeholder="کلمه عبور جدید"
        prefixIcon={<LockKeyholeIcon />}
        className={mixedDirectionInput}
      />

      <TextField<PasswordStepValues>
        name="confirmPassword"
        label="تکرار کلمه عبور جدید"
        type="password"
        autoComplete="new-password"
        dir="ltr"
        size="lg"
        color="primary"
        placeholder="تکرار کلمه عبور جدید"
        prefixIcon={<LockKeyholeIcon />}
        className={mixedDirectionInput}
      />

      <Button type="submit" size="lg" color="primary" block>
        بازنشانی کلمه عبور
      </Button>
    </Form>
  );
}
