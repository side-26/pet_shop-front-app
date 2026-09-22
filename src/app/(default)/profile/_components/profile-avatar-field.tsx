'use client';

import { PencilIcon, Save, Trash2Icon, UserRound } from 'lucide-react';
import type { MouseEvent } from 'react';

import {
  DEFAULT_IMAGE_ACCEPT_TYPES,
  ImageFileField,
  useImageFileField,
} from '@/components/common/image-file-field';
import { ImageFilePreview } from '@/components/common/image-file-preview';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { toast } from '@/components/ui/toast';

type ProfileAvatarValues = { avatar: File | null };
const profileAvatarInputId = 'profile-avatar-input';
const profileAvatarAcceptedFormats = DEFAULT_IMAGE_ACCEPT_TYPES.map((acceptType) =>
  acceptType === 'image/webp' ? 'WebP' : acceptType.replace('image/', '').toUpperCase(),
).join(', ');

function ProfileAvatarActions() {
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
        disabled={!imageFile}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          deleteImageFile();
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

export function ProfileAvatarField() {
  return (
    <Form<ProfileAvatarValues>
      handleSubmit={() =>
        toast.add({
          title: 'تصویر پروفایل ذخیره شد',
          description: 'تصویر جدید شما با موفقیت ثبت شد.',
          type: 'success',
        })
      }
      options={{ defaultValues: { avatar: null } }}
    >
      {({ formState: { isSubmitting } }) => (
        <ImageFileField<ProfileAvatarValues>
          id={profileAvatarInputId}
          name="avatar"
          aria-label="انتخاب تصویر پروفایل"
        >
          <div className="tw:flex tw:flex-col tw:items-center tw:gap-2">
            <ImageFilePreview
              avatar
              alt="پیش‌نمایش تصویر پروفایل"
              className="tw:size-16"
              fallback={
                <Avatar className="tw:size-16">
                  <AvatarFallback className="tw:bg-primary tw:text-primary-foreground">
                    <UserRound className="tw:size-7" aria-hidden="true" />
                  </AvatarFallback>
                </Avatar>
              }
            />
            <ProfileAvatarActions />
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
