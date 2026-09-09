'use client';

import { forwardRef, useCallback, useImperativeHandle, useState } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { useCreateBrand } from '@/entities/brands/brands.client';
import { brandSchema, type BrandInput } from '@/entities/brands/brands.schema';

import { BrandFormFields } from './brand-form-fields';
import type { BrandFormDialogHandle } from './brand-form-dialog.types';

const FORM_ID = 'create-brand-form';

type Props = {
  openOnMount?: boolean;
  onClosed: () => void;
  onCreated: () => void;
};

export const CreateBrandDialog = forwardRef<BrandFormDialogHandle, Props>(
  function CreateBrandDialog({ openOnMount = false, onClosed, onCreated }, ref) {
    const [open, setOpen] = useState(openOnMount);
    const close = useCallback(() => {
      setOpen(false);
      onClosed();
    }, [onClosed]);
    const { formRef, handleSubmit, isPending } = useCreateBrand(() => {
      setOpen(false);
      onCreated();
    });

    useImperativeHandle(
      ref,
      () => ({
        open: () => setOpen(true),
        close,
        toggle: () => (open ? close() : setOpen(true)),
      }),
      [close, open],
    );

    return (
      <Dialog
        open={open}
        onOpenChange={(nextOpen) => {
          if (nextOpen) setOpen(true);
          else close();
        }}
      >
        <FormDialogContent
          formId={FORM_ID}
          isLoading={isPending}
          onClose={close}
          submitText="ایجاد برند"
          title="ایجاد برند جدید"
          size="lg"
          contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
        >
          <Form<BrandInput>
            ref={formRef}
            id={FORM_ID}
            validationSchema={brandSchema}
            options={{
              defaultValues: {
                title: '',
                title_fa: '',
                description: '',
                isEnable: true,
                logo: null,
              },
            }}
            handleSubmit={handleSubmit}
            aria-label="فرم ایجاد برند"
          >
            <BrandFormFields />
          </Form>
        </FormDialogContent>
      </Dialog>
    );
  },
);
