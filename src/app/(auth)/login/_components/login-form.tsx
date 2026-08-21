'use client';

import Link from 'next/link';
import { LockKeyholeIcon, PhoneIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CheckboxField } from '@/components/ui/fields/checkbox-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { routePaths } from '@/configs/route.path';
import { useLoginUser } from '@/entities/auth/auth.client';
import { loginUserSchema, type LoginUserInput } from '@/entities/auth/auth.schema';

export function LoginForm() {
  const { formRef, handleSubmit } = useLoginUser();

  return (
    <Form<LoginUserInput>
      ref={formRef}
      validationSchema={loginUserSchema}
      options={{
        defaultValues: { phoneNumber: '', password: '', rememberMe: false },
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

          <div className="tw:flex tw:min-h-11 tw:items-center tw:justify-between tw:gap-2">
            <CheckboxField<LoginUserInput>
              name="rememberMe"
              label="مرا به خاطر بسپار"
              size="sm"
              variant="outlined"
              checkedColor="primary"
              uncheckedColor="primary"
            />
            <Link
              href={routePaths.forgetPassword}
              className="tw:inline-flex tw:min-h-11 tw:shrink-0 tw:items-center tw:rounded-lg tw:px-1 tw:text-label-s tw:text-primary tw:outline-none tw:transition-colors tw:hover:text-primary-hover tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:motion-reduce:transition-none"
            >
              فراموشی کلمه عبور؟
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            color="primary"
            block
            isLoading={formMethods.formState.isSubmitting}
            loadingText="در حال ورود"
          >
            ورود
          </Button>
        </>
      )}
    </Form>
  );
}
