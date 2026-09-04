'use client';

import { KeyRoundIcon, SaveIcon } from 'lucide-react';
import { useRef, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form, type FormHandle } from '@/components/ui/form';
import { submitCurrentUserPassword } from '@/entities/users/users.client';
import {
  changeCurrentUserPasswordSchema,
  type ChangeCurrentUserPasswordInput,
} from '@/entities/users/users.schema';

export const ADMIN_PROFILE_PASSWORD_FORM_ID = 'admin-profile-password-form';

export function AdminProfilePasswordForm() {
  const formRef = useRef<FormHandle<ChangeCurrentUserPasswordInput>>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(input: ChangeCurrentUserPasswordInput) {
    const form = formRef.current;
    if (!form || isPending) return;

    startTransition(async () => {
      if (await submitCurrentUserPassword(input, form.setError)) {
        form.reset({ oldPassword: '', password: '', repeatPassword: '' });
      }
    });
  }

  return (
    <Form<ChangeCurrentUserPasswordInput>
      ref={formRef}
      id={ADMIN_PROFILE_PASSWORD_FORM_ID}
      validationSchema={changeCurrentUserPasswordSchema}
      options={{ defaultValues: { oldPassword: '', password: '', repeatPassword: '' } }}
      handleSubmit={handleSubmit}
      aria-label="فرم تغییر کلمه عبور"
      aria-busy={isPending || undefined}
    >
      <fieldset disabled={isPending} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
        <TextField<ChangeCurrentUserPasswordInput>
          name="oldPassword"
          label="کلمه عبور فعلی"
          type="password"
          autoComplete="current-password"
          required
        />
        <TextField<ChangeCurrentUserPasswordInput>
          name="password"
          label="کلمه عبور جدید"
          type="password"
          autoComplete="new-password"
          required
        />
        <TextField<ChangeCurrentUserPasswordInput>
          name="repeatPassword"
          label="تکرار کلمه عبور جدید"
          type="password"
          autoComplete="new-password"
          required
        />
      </fieldset>
    </Form>
  );
}

export function AdminProfilePasswordSubmit({ isSkeleton = false }: { isSkeleton?: boolean }) {
  return (
    <Button type="submit" form={ADMIN_PROFILE_PASSWORD_FORM_ID} disabled={isSkeleton}>
      <KeyRoundIcon data-icon="inline-start" aria-hidden="true" />
      <SaveIcon data-icon="inline-end" aria-hidden="true" />
      تغییر کلمه عبور
    </Button>
  );
}
