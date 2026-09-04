'use client';

import { CameraIcon, SaveIcon, UserRoundIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useRef, useTransition } from 'react';

import { ImageFileField } from '@/components/common/image-file-field';
import { ImageFilePreview } from '@/components/common/image-file-preview';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/fields/text-field';
import { Form, type FormHandle } from '@/components/ui/form';
import { submitCurrentUserProfile } from '@/entities/users/users.client';
import type { CurrentUserDTO } from '@/entities/users/users.dto';
import {
  updateCurrentUserProfileSchema,
  type UpdateCurrentUserProfileInput,
} from '@/entities/users/users.schema';

export const ADMIN_PROFILE_PERSONAL_INFO_FORM_ID = 'admin-profile-personal-info-form';

function initials(user: CurrentUserDTO) {
  return `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}` || '_';
}

export function AdminProfilePersonalInfoForm({ user }: { user: CurrentUserDTO }) {
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
      id={ADMIN_PROFILE_PERSONAL_INFO_FORM_ID}
      validationSchema={updateCurrentUserProfileSchema}
      options={{
        defaultValues: { firstName: user.firstName, lastName: user.lastName, avatar: null },
      }}
      handleSubmit={handleSubmit}
      aria-label="فرم اطلاعات شخصی"
      aria-busy={isPending || undefined}
    >
      <fieldset disabled={isPending} className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5">
        <ImageFileField<UpdateCurrentUserProfileInput>
          name="avatar"
          hint="JPEG، PNG یا WebP تا حداکثر ۱ مگابایت"
          aria-label="انتخاب تصویر پروفایل"
        >
          <div className="tw:flex tw:items-center tw:gap-4 tw:rounded-2xl tw:border tw:border-dashed tw:border-border-strong tw:bg-muted/35 tw:p-4 tw:hover:bg-muted/55">
            <ImageFilePreview
              avatar
              alt="پیش‌نمایش تصویر پروفایل"
              initialImageUrl={user.avatar || null}
              className="tw:size-20"
              avatarFallback={initials(user)}
              fallback={
                <Avatar className="tw:size-20">
                  <AvatarFallback className="tw:bg-primary-muted tw:text-primary">
                    <UserRoundIcon aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
              }
            />
            <div className="tw:flex tw:min-w-0 tw:flex-1 tw:flex-col tw:gap-1">
              <span className="tw:text-label-l tw:text-foreground">تصویر پروفایل</span>
              <span className="tw:text-body-s tw:text-muted-foreground">
                برای انتخاب یا جایگزینی تصویر، این بخش را انتخاب کنید.
              </span>
            </div>
            <CameraIcon aria-hidden="true" className="tw:shrink-0 tw:text-primary" />
          </div>
        </ImageFileField>

        <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2">
          <TextField<UpdateCurrentUserProfileInput>
            name="firstName"
            label="نام"
            autoComplete="given-name"
            required
          />
          <TextField<UpdateCurrentUserProfileInput>
            name="lastName"
            label="نام خانوادگی"
            autoComplete="family-name"
            required
          />
        </div>
      </fieldset>
    </Form>
  );
}

export function AdminProfilePersonalInfoSubmit({ isSkeleton = false }: { isSkeleton?: boolean }) {
  return (
    <Button type="submit" form={ADMIN_PROFILE_PERSONAL_INFO_FORM_ID} disabled={isSkeleton}>
      <SaveIcon data-icon="inline-start" aria-hidden="true" />
      ذخیره اطلاعات
    </Button>
  );
}
