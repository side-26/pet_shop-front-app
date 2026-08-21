'use client';

import { LockKeyholeIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { useResetPassword } from '@/entities/auth/auth.client';
import { resetPasswordSchema, type ResetPasswordInput } from '@/entities/auth/auth.schema';

export function PasswordStepForm() {
  const { formRef, handleSubmit } = useResetPassword();

  return (
    <Form<ResetPasswordInput>
      ref={formRef}
      validationSchema={resetPasswordSchema}
      options={{
        defaultValues: { newPassword: '', confirmPassword: '' },
        mode: 'onBlur',
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم تنظیم کلمه عبور جدید"
      className="tw:gap-3"
    >
      {({ formState: { isSubmitting } }) => (
        <>
          <TextField<ResetPasswordInput>
            name="newPassword"
            label="کلمه عبور جدید"
            type="password"
            autoComplete="new-password"
            autoFocus
            size="lg"
            color="primary"
            placeholder="کلمه عبور جدید"
            prefixIcon={<LockKeyholeIcon />}
            readOnly={isSubmitting}
          />

          <TextField<ResetPasswordInput>
            name="confirmPassword"
            label="تکرار کلمه عبور جدید"
            type="password"
            autoComplete="new-password"
            size="lg"
            color="primary"
            placeholder="تکرار کلمه عبور جدید"
            prefixIcon={<LockKeyholeIcon />}
            readOnly={isSubmitting}
          />

          <Button
            type="submit"
            size="lg"
            color="primary"
            block
            isLoading={isSubmitting}
            loadingText="در حال بازنشانی کلمه عبور"
          >
            بازنشانی کلمه عبور
          </Button>
        </>
      )}
    </Form>
  );
}
