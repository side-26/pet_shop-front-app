'use client';

import { AtSign, CakeSlice, Save, UserRound } from 'lucide-react';
import { useRouter } from 'nextjs-toploader/app';
import { useRef, useTransition } from 'react';

import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
import { TextField } from '@/components/ui/fields/text-field';
import { Form, type FormHandle } from '@/components/ui/form';
import { submitCurrentUserProfile } from '@/entities/users/users.client';
import {
  updateCurrentUserProfileSchema,
  type UpdateCurrentUserProfileInput,
} from '@/entities/users/users.schema';
import type { ProfileAccountDTO } from '@/entities/profile/profile.dto';

export function ProfilePersonalInfoForm({ user }: { user: ProfileAccountDTO }) {
  const formRef = useRef<FormHandle<UpdateCurrentUserProfileInput>>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(input: UpdateCurrentUserProfileInput) {
    const form = formRef.current;
    if (!form || isPending) return;

    startTransition(async () => {
      if (await submitCurrentUserProfile(input, form.setError)) router.refresh();
    });
  }

  return (
    <Form<UpdateCurrentUserProfileInput>
      ref={formRef}
      validationSchema={updateCurrentUserProfileSchema}
      options={{
        defaultValues: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          nationalCode: user.nationalCode,
          age: user.age ?? undefined,
          birthDate: user.birthDate,
          avatar: null,
        },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم اطلاعات شخصی"
      aria-busy={isPending || undefined}
    >
      {({ formState: { isSubmitting } }) => (
        <fieldset
          disabled={isPending}
          className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5"
        >
          <div className="tw:grid tw:items-start tw:gap-4 tw:md:grid-cols-3">
            <TextField<UpdateCurrentUserProfileInput>
              name="firstName"
              label="نام"
              prefixIcon={<UserRound />}
              autoComplete="given-name"
              size="lg"
              required
            />
            <TextField<UpdateCurrentUserProfileInput>
              name="lastName"
              label="نام خانوادگی"
              prefixIcon={<UserRound />}
              autoComplete="family-name"
              size="lg"
              required
            />
            <TextField<UpdateCurrentUserProfileInput>
              name="email"
              label="ایمیل"
              prefixIcon={<AtSign />}
              autoComplete="email"
              type="email"
              dir="ltr"
              size="lg"
              required
            />
            <TextField<UpdateCurrentUserProfileInput>
              name="nationalCode"
              label="کد ملی"
              inputMode="numeric"
              dir="ltr"
              size="lg"
              required
            />
            <TextField<UpdateCurrentUserProfileInput>
              name="age"
              label="سن"
              type="number"
              inputMode="numeric"
              min={4}
              dir="ltr"
              prefixIcon={<CakeSlice />}
              size="lg"
              required
            />
            <DatePicker<UpdateCurrentUserProfileInput>
              name="birthDate"
              label="تاریخ تولد"
              size="lg"
            />
          </div>
          <div className="tw:flex tw:justify-end">
            <Button type="submit" size="lg" isLoading={isSubmitting} loadingText="در حال ذخیره">
              <Save data-icon="inline-start" aria-hidden="true" />
              ذخیره تغییرات
            </Button>
          </div>
        </fieldset>
      )}
    </Form>
  );
}
