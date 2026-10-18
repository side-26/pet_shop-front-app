'use client';

import { LockKeyholeIcon, PhoneIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { useLoginUser } from '@/entities/auth/auth.client';
import { loginUserSchema, type LoginUserInput } from '@/entities/auth/auth.schema';

export function LoginForm() {
  const { formRef, handleSubmit, isPending } = useLoginUser();

  return (
    <Form<LoginUserInput>
      ref={formRef}
      validationSchema={loginUserSchema}
      options={{
        defaultValues: { phoneNumber: '', password: '' },
        mode: 'onBlur',
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم ورود"
      className="tw:gap-3 tw:[&_[data-slot=field]>span:last-child:has(>span:empty)]:hidden tw:[@media(max-height:430px)]:gap-1.5 tw:[@media(max-height:430px)]:[&_[data-slot=field-label]]:sr-only"
    >
      {(formMethods) => (
        <>
          <TextField<LoginUserInput>
            name="phoneNumber"
            label="شماره موبایل"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            size="lg"
            color="primary"
            placeholder="شماره موبایل"
            prefixIcon={<PhoneIcon />}
          />

          <TextField<LoginUserInput>
            name="password"
            label="کلمه عبور"
            type="password"
            autoComplete="current-password"
            size="lg"
            color="primary"
            placeholder="کلمه عبور"
            prefixIcon={<LockKeyholeIcon />}
          />

          <Button
            type="submit"
            size="lg"
            color="primary"
            block
            isLoading={formMethods.formState.isSubmitting || isPending}
            loadingText="در حال ورود"
          >
            ورود
          </Button>
        </>
      )}
    </Form>
  );
}
