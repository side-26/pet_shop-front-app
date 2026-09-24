'use client';

import dynamic from 'next/dynamic';
import { Suspense, useRef, useState, type ReactNode, type RefObject } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Form, type FormHandle } from '@/components/ui/form';
import { cn } from '@/lib/utils';

const AsyncCreateNewAddressDialogContent = dynamic(
  () => import('./create-new-address-dialog-content'),
);

const FORM_ID = 'create-new-address-location-form';
const INITIAL_LNG_LAT = [51.389, 35.6892] as const;

type Props = Readonly<{ onClose: () => void }>;
type LocationFormInput = { lngLat: readonly [number, number] };

type LocationFormBodyProps = Readonly<{
  children?: ReactNode;
  formRef: RefObject<FormHandle<LocationFormInput> | null>;
  handleSubmit: () => void;
  isSkeleton?: boolean;
}>;

export function CreateNewAddressLocationFormBody({
  children,
  formRef,
  handleSubmit,
  isSkeleton = false,
}: LocationFormBodyProps) {
  return (
    <Form<LocationFormInput>
      ref={formRef}
      id={FORM_ID}
      handleSubmit={handleSubmit}
      options={{ defaultValues: { lngLat: INITIAL_LNG_LAT } }}
      aria-label="انتخاب موقعیت نشانی"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <fieldset disabled={isSkeleton} className="tw:w-full tw:min-w-0">
        {isSkeleton ? (
          <div
            aria-hidden="true"
            className="tw:h-80 tw:w-full tw:rounded-md tw:border tw:border-border/60 tw:bg-muted"
          />
        ) : (
          children
        )}
      </fieldset>
    </Form>
  );
}

export function CreateNewAddressDialogContentWrapper({ onClose }: Props) {
  const [lngLat, setLngLat] = useState<readonly [number, number]>(INITIAL_LNG_LAT);
  const formRef = useRef<FormHandle<LocationFormInput>>(null);

  return (
    <FormDialogContent
      formId={FORM_ID}
      onClose={onClose}
      submitText="ادامه"
      title="موقعیت نشانی را انتخاب کنید"
      size="xl"
      contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
    >
      <Suspense
        fallback={
          <CreateNewAddressLocationFormBody
            formRef={formRef}
            handleSubmit={() => undefined}
            isSkeleton
          />
        }
      >
        <AsyncCreateNewAddressDialogContent lngLat={lngLat} setLngLat={setLngLat}>
          {(content) => (
            <CreateNewAddressLocationFormBody formRef={formRef} handleSubmit={() => undefined}>
              {content}
            </CreateNewAddressLocationFormBody>
          )}
        </AsyncCreateNewAddressDialogContent>
      </Suspense>
    </FormDialogContent>
  );
}
