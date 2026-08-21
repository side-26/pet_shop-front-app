'use client';

import { LockKeyholeIcon, PhoneIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { useRegisterUser } from '@/entities/auth/auth.client';
import { registerUserSchema, type RegisterUserInput } from '@/entities/auth/auth.schema';

const mixedDirectionInput =
  'tw:text-left tw:[&::placeholder]:text-right tw:[&::placeholder]:[direction:rtl]';

export function RegisterForm() {
  const { formRef, handleSubmit } = useRegisterUser();

  return (
    <Form<RegisterUserInput>
      ref={formRef}
      validationSchema={registerUserSchema}
      options={{
        defaultValues: { phoneNumber: '', password: '' },
        mode: 'onBlur',
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ثبت‌نام"
      className="tw:gap-3 tw:[&_[data-slot=field]>span:last-child:has(>span:empty)]:hidden tw:[@media(max-height:430px)]:gap-1.5 tw:[@media(max-height:430px)]:[&_[data-slot=field-label]]:sr-only"
    >
      {(formMethods) => (
        <>
          <TextField<RegisterUserInput>
            name="phoneNumber"
            label="شماره موبایل"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            dir="ltr"
            size="lg"
            color="primary"
            placeholder="شماره موبایل"
            prefixIcon={<PhoneIcon />}
            className={mixedDirectionInput}
          />

          <TextField<RegisterUserInput>
            name="password"
            label="کلمه عبور"
            type="password"
            autoComplete="new-password"
            dir="ltr"
            size="lg"
            color="primary"
            placeholder="کلمه عبور"
            prefixIcon={<LockKeyholeIcon />}
            className={mixedDirectionInput}
          />

          <Button
            type="submit"
            size="lg"
            color="primary"
            block
            isLoading={formMethods.formState.isSubmitting}
            loadingText="در حال ثبت‌نام"
          >
            ثبت‌نام
          </Button>
        </>
      )}
    </Form>
  );
}
