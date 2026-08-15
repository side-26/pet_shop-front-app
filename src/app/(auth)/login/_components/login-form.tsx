'use client';

import Link from 'next/link';
import { LockKeyholeIcon, PhoneIcon } from 'lucide-react';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import { CheckboxField } from '@/components/ui/fields/checkbox-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';

type LoginValues = {
  phoneNumber: string;
  password: string;
  rememberMe: boolean;
};

const loginSchema: yup.ObjectSchema<LoginValues> = yup.object({
  phoneNumber: yup
    .string()
    .matches(/^09\d{9}$/, {
      message: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.',
      excludeEmptyString: true,
    })
    .required('شماره موبایل الزامی است.'),
  password: yup
    .string()
    .required('رمز عبور الزامی است.')
    .min(6, 'رمز عبور باید حداقل ۶ نویسه باشد.'),
  rememberMe: yup.boolean().required(),
});

const mixedDirectionInput =
  'tw:text-left tw:[&::placeholder]:text-right tw:[&::placeholder]:[direction:rtl]';

export function LoginForm() {
  return (
    <Form<LoginValues>
      validationSchema={loginSchema}
      options={{
        defaultValues: { phoneNumber: '', password: '', rememberMe: false },
        mode: 'onBlur',
      }}
      handleSubmit={() => undefined}
      aria-label="فرم ورود"
      className="tw:gap-3 tw:[&_[data-slot=field]>span:last-child:has(>span:empty)]:hidden tw:[@media(max-height:430px)]:gap-1.5 tw:[@media(max-height:430px)]:[&_[data-slot=field-label]]:sr-only"
    >
      <TextField<LoginValues>
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

      <TextField<LoginValues>
        name="password"
        label="رمز عبور"
        type="password"
        autoComplete="current-password"
        dir="ltr"
        size="lg"
        color="primary"
        placeholder="رمز عبور"
        prefixIcon={<LockKeyholeIcon />}
        className={mixedDirectionInput}
      />

      <div className="tw:flex tw:min-h-11 tw:items-center tw:justify-between tw:gap-2">
        <CheckboxField<LoginValues>
          name="rememberMe"
          label="مرا به خاطر بسپار"
          size="sm"
          variant="outlined"
          checkedColor="primary"
          uncheckedColor="primary"
        />
        <Link
          href="/forgot-password"
          className="tw:inline-flex tw:min-h-11 tw:shrink-0 tw:items-center tw:rounded-lg tw:px-1 tw:text-label-s tw:text-primary tw:outline-none tw:transition-colors tw:hover:text-primary-hover tw:focus-visible:ring-3 tw:focus-visible:ring-primary/25 tw:motion-reduce:transition-none"
        >
          فراموشی رمز عبور؟
        </Link>
      </div>

      <Button type="submit" size="lg" color="primary" className="tw:w-full">
        ورود
      </Button>
    </Form>
  );
}

export { type LoginValues };
