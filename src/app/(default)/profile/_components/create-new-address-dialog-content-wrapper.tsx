'use client';

import dynamic from 'next/dynamic';
import { useRouter } from 'nextjs-toploader/app';
import { Suspense, useEffect, useRef, useState, useTransition, type RefObject } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Button } from '@/components/ui/button';
import { CheckboxField } from '@/components/ui/fields/checkbox-field';
import { SelectField } from '@/components/ui/fields/select-field';
import { TextField } from '@/components/ui/fields/text-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { Form, type FormHandle } from '@/components/ui/form';
import { useAuthStore } from '@/entities/auth/auth.store';
import { reverseGeocodeAction } from '@/entities/locations/locations.actions';
import type { ReverseGeocodedLocationDTO } from '@/entities/locations/locations.dto';
import { createProfileAddressAction } from '@/entities/profile/profile.actions';
import {
  createProfileAddressSchema,
  type CreateProfileAddressInput,
} from '@/entities/profile/profile.schema';
import { cn } from '@/lib/utils';
import { globalErrorHandler } from '@/utils/helpers';
import { toast } from '@/components/ui/toast';

import { CreateNewAddressLocationContent } from './create-new-address-location-content';

const AsyncCreateNewAddressDialogContent = dynamic(
  () => import('./create-new-address-dialog-content'),
);
const LOCATION_FORM_ID = 'create-new-address-location-form';
const DETAILS_FORM_ID = 'create-new-address-details-form';
const INITIAL_LNG_LAT = [51.389, 35.6892] as const;

type Props = Readonly<{ onClose: () => void }>;
type LocationFormInput = { lngLat: readonly [number, number] };
type Step = 'location' | 'details';
type ReverseGeocodeResult = Awaited<ReturnType<typeof reverseGeocodeAction>>;

export function CreateNewAddressLocationFormBody({
  formRef,
  handleSubmit,
  lngLat = INITIAL_LNG_LAT,
  setLngLat,
  isSkeleton = false,
}: Readonly<{
  formRef: RefObject<FormHandle<LocationFormInput> | null>;
  handleSubmit: () => void;
  lngLat?: readonly [number, number];
  setLngLat?: (lngLat: readonly [number, number]) => void;
  isSkeleton?: boolean;
}>) {
  return (
    <Form<LocationFormInput>
      ref={formRef}
      id={LOCATION_FORM_ID}
      handleSubmit={handleSubmit}
      options={{ defaultValues: { lngLat: INITIAL_LNG_LAT } }}
      aria-label="انتخاب موقعیت نشانی"
      aria-busy={isSkeleton || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <fieldset disabled={isSkeleton} className="tw:w-full tw:min-w-0">
        {isSkeleton ? (
          <div aria-hidden="true" className="tw:h-80 tw:w-full tw:rounded-md tw:bg-muted" />
        ) : (
          <CreateNewAddressLocationContent
            lngLat={lngLat}
            setLngLat={(value) => {
              setLngLat?.(value);
              formRef.current?.setValue('lngLat', value);
            }}
          />
        )}
      </fieldset>
    </Form>
  );
}

function ReceiverFields({ isSkeleton = false }: { isSkeleton?: boolean }) {
  const identity = useAuthStore((state) => state.userIdentity);
  const { control, setValue } = useFormContext<CreateProfileAddressInput>();
  const receiverIsMe = useWatch({ control, name: 'receiverIsMe' });
  useEffect(() => {
    if (!receiverIsMe || !identity) return;
    setValue('firstName', identity.firstName);
    setValue('lastName', identity.lastName);
    setValue('nationalCode', identity.nationalCode);
    setValue('phoneNumber', identity.phoneNumber);
  }, [identity, receiverIsMe, setValue]);
  const disabled = isSkeleton || Boolean(receiverIsMe);
  return (
    <fieldset
      disabled={disabled}
      className="tw:grid tw:w-full tw:min-w-0 tw:gap-4 tw:md:grid-cols-2"
    >
      <TextField<CreateProfileAddressInput>
        name="firstName"
        label="نام گیرنده"
        autoComplete="given-name"
        required
        disabled={disabled}
      />
      <TextField<CreateProfileAddressInput>
        name="lastName"
        label="نام خانوادگی گیرنده"
        autoComplete="family-name"
        required
        disabled={disabled}
      />
      <TextField<CreateProfileAddressInput>
        name="nationalCode"
        label="کد ملی گیرنده"
        inputMode="numeric"
        dir="ltr"
        required
        disabled={disabled}
      />
      <TextField<CreateProfileAddressInput>
        name="phoneNumber"
        label="شماره موبایل گیرنده"
        type="tel"
        inputMode="tel"
        dir="ltr"
        autoComplete="tel"
        required
        disabled={disabled}
      />
    </fieldset>
  );
}

type AddressFormBodyProps = Readonly<{
  formRef: RefObject<FormHandle<CreateProfileAddressInput> | null>;
  handleSubmit: (input: CreateProfileAddressInput) => void;
  lngLat: readonly [number, number];
  location?: ReverseGeocodedLocationDTO;
  isPending?: boolean;
  isSkeleton?: boolean;
}>;

export function CreateNewAddressDetailsFormBody({
  formRef,
  handleSubmit,
  lngLat,
  location,
  isPending = false,
  isSkeleton = false,
}: AddressFormBodyProps) {
  const identity = useAuthStore((state) => state.userIdentity);
  const province = location?.state ?? 'در حال دریافت استان';
  const city = location?.city ?? 'در حال دریافت شهر';
  const detailAddress = location?.formatted_address ?? 'در حال دریافت نشانی';
  return (
    <Form<CreateProfileAddressInput>
      ref={formRef}
      id={DETAILS_FORM_ID}
      validationSchema={createProfileAddressSchema}
      handleSubmit={handleSubmit}
      options={{
        defaultValues: {
          province,
          city,
          detailAddress,
          latLng: [lngLat[1], lngLat[0]],
          plate: '',
          unit: '',
          postalCode: '',
          receiverIsMe: true,
          firstName: identity?.firstName ?? '',
          lastName: identity?.lastName ?? '',
          nationalCode: identity?.nationalCode ?? '',
          phoneNumber: identity?.phoneNumber ?? '',
        },
      }}
      aria-label="جزئیات نشانی"
      aria-busy={isSkeleton || isPending || undefined}
      className={cn(isSkeleton && 'skeleton tw:pointer-events-none tw:select-none')}
    >
      <fieldset
        disabled={isSkeleton || isPending}
        className="tw:flex tw:w-full tw:min-w-0 tw:flex-col tw:gap-5"
      >
        <div className="tw:grid tw:items-start tw:gap-4 tw:md:grid-cols-2">
          <SelectField<CreateProfileAddressInput>
            name="province"
            label="استان"
            options={[{ value: province, label: province }]}
            readOnly
            required
          />
          <TextField<CreateProfileAddressInput> name="city" label="شهر" readOnly required />
        </div>
        <TextareaField<CreateProfileAddressInput>
          name="detailAddress"
          label="نشانی"
          rows={3}
          required
        />
        <div className="tw:grid tw:items-start tw:gap-4 tw:md:grid-cols-3">
          <TextField<CreateProfileAddressInput> name="plate" label="پلاک" required />
          <TextField<CreateProfileAddressInput> name="unit" label="واحد" />
          <TextField<CreateProfileAddressInput>
            name="postalCode"
            label="کد پستی"
            inputMode="numeric"
            dir="ltr"
            required
          />
        </div>
        <CheckboxField<CreateProfileAddressInput> name="receiverIsMe" label="گیرنده خودم هستم" />
        <ReceiverFields isSkeleton={isSkeleton || isPending} />
      </fieldset>
    </Form>
  );
}

export function CreateNewAddressDialogContentWrapper({ onClose }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<Step>('location');
  const [lngLat, setLngLat] = useState<readonly [number, number]>(INITIAL_LNG_LAT);
  const [request, setRequest] = useState<Promise<ReverseGeocodeResult> | null>(null);
  const locationFormRef = useRef<FormHandle<LocationFormInput>>(null);
  const detailsFormRef = useRef<FormHandle<CreateProfileAddressInput>>(null);
  const [isPending, startTransition] = useTransition();
  function close() {
    setStep('location');
    setLngLat(INITIAL_LNG_LAT);
    locationFormRef.current?.setValue('lngLat', INITIAL_LNG_LAT);
    setRequest(null);
    onClose();
  }
  function continueToDetails() {
    setRequest(reverseGeocodeAction({ lat: lngLat[1], lng: lngLat[0] }));
    setStep('details');
  }
  function submitAddress(input: CreateProfileAddressInput) {
    const form = detailsFormRef.current;
    if (!form || isPending) return;
    startTransition(async () => {
      const result = await createProfileAddressAction(input);
      if (!result)
        return globalErrorHandler({
          isSuccess: false,
          message: 'ثبت نشانی انجام نشد.',
          data: { messages: {}, details: {} },
        });
      if (!result.isSuccess) return globalErrorHandler(result, { showErrorFields: form.setError });
      toast.add({ type: 'success', title: result.message });
      close();
      router.refresh();
    });
  }
  if (step === 'location')
    return (
      <FormDialogContent
        formId={LOCATION_FORM_ID}
        onClose={close}
        submitText="ادامه"
        title="موقعیت نشانی را انتخاب کنید"
        size="xl"
        contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
      >
        <CreateNewAddressLocationFormBody
          formRef={locationFormRef}
          handleSubmit={continueToDetails}
          lngLat={lngLat}
          setLngLat={setLngLat}
        />
      </FormDialogContent>
    );
  return (
    <FormDialogContent
      formId={DETAILS_FORM_ID}
      onClose={close}
      isLoading={isPending}
      submitText="ثبت نشانی"
      title="جزئیات آدرس را وارد کنید"
      size="xl"
      headerAction={
        <Button type="button" variant="text" size="sm" onClick={() => setStep('location')}>
          ویرایش موقعیت
        </Button>
      }
      contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
    >
      {request ? (
        <Suspense
          fallback={
            <CreateNewAddressDetailsFormBody
              formRef={detailsFormRef}
              handleSubmit={() => undefined}
              lngLat={lngLat}
              isSkeleton
            />
          }
        >
          <AsyncCreateNewAddressDialogContent request={request}>
            {(result) =>
              result.isSuccess ? (
                <CreateNewAddressDetailsFormBody
                  formRef={detailsFormRef}
                  handleSubmit={submitAddress}
                  lngLat={lngLat}
                  location={result.data}
                  isPending={isPending}
                />
              ) : (
                <p role="alert" className="tw:text-body-m tw:text-error">
                  {result.message}
                </p>
              )
            }
          </AsyncCreateNewAddressDialogContent>
        </Suspense>
      ) : null}
    </FormDialogContent>
  );
}
