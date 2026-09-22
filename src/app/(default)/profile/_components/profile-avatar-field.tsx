'use client';

import { PencilIcon, Save, Trash2Icon, UserRound } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useRef, useTransition } from 'react';
import { useRouter } from 'nextjs-toploader/app';

import {
  DEFAULT_IMAGE_ACCEPT_TYPES,
  ImageFileField,
  useImageFileField,
} from '@/components/common/image-file-field';
import { ImageFilePreview } from '@/components/common/image-file-preview';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form, type FormHandle } from '@/components/ui/form';
import { deleteProfileAvatarAction } from '@/entities/profile/profile.actions';
import type { ProfileAccountDTO } from '@/entities/profile/profile.dto';
import { submitCurrentUserProfile } from '@/entities/users/users.client';
import {
  updateCurrentUserProfileSchema,
  type UpdateCurrentUserProfileInput,
} from '@/entities/users/users.schema';
import { globalErrorHandler } from '@/utils/helpers';

const profileAvatarInputId = 'profile-avatar-input';
const profileAvatarAcceptedFormats = DEFAULT_IMAGE_ACCEPT_TYPES.map((acceptType) =>
  acceptType === 'image/webp' ? 'WebP' : acceptType.replace('image/', '').toUpperCase(),
).join(', ');

function ProfileAvatarActions({
  hasPersistedAvatar,
  isPending,
  onDeletePersistedAvatar,
}: {
  hasPersistedAvatar: boolean;
  isPending: boolean;
  onDeletePersistedAvatar: () => void;
}) {
  const { deleteImageFile, imageFile } = useImageFileField();

  function openFilePicker(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    document.getElementById(profileAvatarInputId)?.click();
  }

  return (
    <div className="tw:flex tw:gap-2">
      <Button
        type="button"
        variant="outlined"
        size="sm"
        iconOnly
        aria-label="ویرایش تصویر پروفایل"
        onClick={openFilePicker}
      >
        <PencilIcon aria-hidden="true" />
      </Button>
      <Button
        type="button"
        variant="outlined"
        color="error"
        size="sm"
        iconOnly
        aria-label="حذف تصویر پروفایل"
        disabled={isPending || (!imageFile && !hasPersistedAvatar)}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (imageFile) deleteImageFile();
          else onDeletePersistedAvatar();
        }}
      >
        <Trash2Icon aria-hidden="true" />
      </Button>
    </div>
  );
}

function ProfileAvatarSubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  const { imageFile } = useImageFileField();

  return (
    <Button
      type="submit"
      size="sm"
      disabled={!imageFile}
      isLoading={isSubmitting}
      loadingText="در حال ذخیره"
    >
      <Save data-icon="inline-start" aria-hidden="true" />
      ذخیره تصویر
    </Button>
  );
}

export function ProfileAvatarField({ user }: { user: ProfileAccountDTO }) {
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

  function deletePersistedAvatar() {
    if (isPending) return;

    startTransition(async () => {
      const result = await deleteProfileAvatarAction();
      if (!result?.isSuccess) {
        if (!result) return;
        globalErrorHandler(result);
        return;
      }

      router.refresh();
    });
  }

  return (
    <Form<UpdateCurrentUserProfileInput>
      ref={formRef}
      validationSchema={updateCurrentUserProfileSchema}
      handleSubmit={handleSubmit}
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
    >
      {({ formState: { isSubmitting } }) => (
        <ImageFileField<UpdateCurrentUserProfileInput>
          id={profileAvatarInputId}
          name="avatar"
          aria-label="انتخاب تصویر پروفایل"
        >
          <div className="tw:flex tw:flex-col tw:items-center tw:gap-2">
            <ImageFilePreview
              avatar
              alt="پیش‌نمایش تصویر پروفایل"
              initialImageUrl={user.avatar || null}
              className="tw:size-16"
              fallback={
                <Avatar className="tw:size-16">
                  <AvatarFallback className="tw:bg-primary tw:text-primary-foreground">
                    <UserRound className="tw:size-7" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
              }
            />
            <ProfileAvatarActions
              hasPersistedAvatar={Boolean(user.avatar)}
              isPending={isPending}
              onDeletePersistedAvatar={deletePersistedAvatar}
            />
            <bdi dir="ltr" className="tw:text-label-s tw:text-muted-foreground">
              {profileAvatarAcceptedFormats}
            </bdi>
            <ProfileAvatarSubmitButton isSubmitting={isSubmitting} />
          </div>
        </ImageFileField>
      )}
    </Form>
  );
}
