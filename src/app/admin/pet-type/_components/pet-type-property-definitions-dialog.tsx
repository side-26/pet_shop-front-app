'use client';

import { Suspense, use, useEffect, useRef, useState } from 'react';

import { AdditionalPropertiesField } from '@/components/common/additional-properties-field';
import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { getPetTypePropertyDefinitionsAction } from '@/entities/pet-types/pet-types.actions';
import { useRangePetTypePropertyDefinitions } from '@/entities/pet-types/pet-types.client';
import {
  petTypePropertyDefinitionsFormSchema,
  type PetTypePropertyDefinitionsFormInput,
} from '@/entities/pet-types/pet-types.schema';

const FORM_ID = 'pet-type-property-definitions-form';
const DIALOG_CLASS =
  'tw:h-[min(42rem,calc(100dvh-2rem))] tw:max-h-[calc(100dvh-2rem)] tw:overflow-hidden tw:[&>[data-slot=card]]:h-full tw:[&>[data-slot=card]]:min-h-0';
const DIALOG_CONTENT_CLASS = 'tw:min-h-0 tw:flex-1 tw:overflow-y-auto tw:overscroll-contain';

type Props = {
  petTypeId: string;
  onClose: () => void;
  onUpdated: () => void;
};

function FormContent({
  petTypeId,
  propertyDefinitions,
  onClose,
  onUpdated,
}: Omit<Props, 'request'> & {
  propertyDefinitions: PetTypePropertyDefinitionsFormInput['propertyDefinitions'];
}) {
  const { formRef, handleSubmit, isPending } = useRangePetTypePropertyDefinitions(
    petTypeId,
    onUpdated,
  );

  return (
    <FormDialogContent
      formId={FORM_ID}
      isLoading={isPending}
      onClose={onClose}
      submitText="ذخیره ویژگی‌ها"
      title="ویرایش ویژگی‌های اضافی"
      size="lg"
      className={DIALOG_CLASS}
      contentClassName={DIALOG_CONTENT_CLASS}
    >
      <Form<PetTypePropertyDefinitionsFormInput>
        ref={formRef}
        id={FORM_ID}
        validationSchema={petTypePropertyDefinitionsFormSchema}
        options={{ defaultValues: { propertyDefinitions } }}
        handleSubmit={handleSubmit}
        aria-label="فرم ویرایش ویژگی‌های اضافی"
      >
        <AdditionalPropertiesField<
          PetTypePropertyDefinitionsFormInput,
          'propertyDefinitions'
        > name="propertyDefinitions" />
      </Form>
    </FormDialogContent>
  );
}

type ContentProps = Props & { request: ReturnType<typeof getPetTypePropertyDefinitionsAction> };

function Content({ request, ...props }: ContentProps) {
  const result = use(request);

  if (!result.isSuccess) {
    return (
      <FormDialogContent
        onClose={props.onClose}
        title="ویرایش ویژگی‌های اضافی"
        submitText="ذخیره ویژگی‌ها"
        size="lg"
        className={DIALOG_CLASS}
        contentClassName={DIALOG_CONTENT_CLASS}
      >
        <p role="alert">{result.message}</p>
      </FormDialogContent>
    );
  }

  return (
    <FormContent
      {...props}
      propertyDefinitions={result.data.result.map((item) => ({
        label: item.label,
        value: String(item.value),
      }))}
    />
  );
}

export function PetTypePropertyDefinitionsDialog(props: Props) {
  const [request, setRequest] = useState<ReturnType<
    typeof getPetTypePropertyDefinitionsAction
  > | null>(null);
  const requestRef = useRef<ReturnType<typeof getPetTypePropertyDefinitionsAction> | null>(null);

  useEffect(() => {
    if (requestRef.current) {
      // React Strict Mode re-runs effects in development; reuse the request.
      setRequest(requestRef.current);
      return;
    }

    const nextRequest = getPetTypePropertyDefinitionsAction({ id: props.petTypeId });
    requestRef.current = nextRequest;
    // Server Actions must be invoked after render, never during component rendering.
    setRequest(nextRequest);
  }, [props.petTypeId]);

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) props.onClose();
      }}
    >
      {request ? (
        <Suspense fallback={<LoadingContent onClose={props.onClose} />}>
          <Content {...props} request={request} />
        </Suspense>
      ) : (
        <LoadingContent onClose={props.onClose} />
      )}
    </Dialog>
  );
}

function LoadingContent({ onClose }: Pick<Props, 'onClose'>) {
  return (
    <FormDialogContent
      onClose={onClose}
      title="ویرایش ویژگی‌های اضافی"
      submitText="ذخیره ویژگی‌ها"
      isLoading
      size="lg"
      className={DIALOG_CLASS}
      contentClassName={DIALOG_CONTENT_CLASS}
    >
      <div />
    </FormDialogContent>
  );
}
