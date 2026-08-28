'use client';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { SelectField } from '@/components/ui/fields/select-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';
import { USER_ROLES } from '@/configs/user-role';
import { useCreateUser } from '@/entities/users/users.client';
import { createUserSchema, type CreateUserInput } from '@/entities/users/users.schema';

const CREATE_USER_FORM_ID = 'create-user-form';

const roleOptions = [
  { label: 'مدیر', value: USER_ROLES.ADMIN },
  { label: 'فروشنده', value: USER_ROLES.SELLER },
  { label: 'مشتری', value: USER_ROLES.CUSTOMER },
] as const;

type CreateUserDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
};

export function CreateUserDialog({ open, onOpenChange, onCreated }: CreateUserDialogProps) {
  const { formRef, handleSubmit, isPending } = useCreateUser(onCreated);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <FormDialogContent
        formId={CREATE_USER_FORM_ID}
        isLoading={isPending}
        onClose={() => onOpenChange(false)}
        submitText="ایجاد کاربر"
        title="ایجاد کاربر جدید"
        size="lg"
      >
        <Form<CreateUserInput>
          ref={formRef}
          id={CREATE_USER_FORM_ID}
          validationSchema={createUserSchema}
          options={{
            defaultValues: {
              phoneNumber: '',
              password: '',
              confirmPassword: '',
            },
          }}
          handleSubmit={handleSubmit}
          aria-label="فرم ایجاد کاربر"
        >
          <TextField<CreateUserInput>
            name="phoneNumber"
            label="شماره موبایل"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="09123456789"
            required
          />
          <TextField<CreateUserInput>
            name="password"
            label="کلمه عبور"
            type="password"
            autoComplete="new-password"
            required
          />
          <TextField<CreateUserInput>
            name="confirmPassword"
            label="تکرار کلمه عبور"
            type="password"
            autoComplete="new-password"
            required
          />
          <SelectField<CreateUserInput>
            id="create-user-role"
            name="role"
            label="نقش"
            options={roleOptions}
            placeholder="نقش کاربر را انتخاب کنید"
            required
          />
        </Form>
      </FormDialogContent>
    </Dialog>
  );
}

export { CREATE_USER_FORM_ID };
