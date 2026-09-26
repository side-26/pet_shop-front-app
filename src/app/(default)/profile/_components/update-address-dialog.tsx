'use client';

import dynamic from 'next/dynamic';
import { Suspense, useCallback, useRef, useState, useTransition } from 'react';

import { FormDialogContent } from '@/components/common/form-dialog-content';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Form, type FormHandle } from '@/components/ui/form';
import { reverseGeocodeAction } from '@/entities/locations/locations.actions';
import type { ReverseGeocodedLocationDTO } from '@/entities/locations/locations.dto';
import {
  updateProfileAddressAction,
  type getProfileAddressAction,
} from '@/entities/profile/profile.actions';
import type { ProfileAddressDTO } from '@/entities/profile/profile.dto';
import type { CreateProfileAddressInput } from '@/entities/profile/profile.schema';
import { globalErrorHandler } from '@/utils/helpers';
import { toast } from '@/components/ui/toast';

import { CreateNewAddressDetailsFormBody } from './create-new-address-dialog-content-wrapper';

const AsyncContent = dynamic(() => import('./update-address-dialog-content'));
const DynamicMap = dynamic(
  () =>
    import('./create-new-address-location-content').then(
      (module) => module.CreateNewAddressLocationContent,
    ),
  {
    ssr: false,
    loading: () => (
      <div aria-busy="true" className="skeleton tw:h-80 tw:w-full tw:rounded-md tw:bg-muted" />
    ),
  },
);
const DETAILS_FORM_ID = 'update-address-details-form';
const LOCATION_FORM_ID = 'update-address-location-form';

export function UpdateAddressDialog({
  addressId,
  request,
  onClose,
}: Readonly<{
  addressId: string;
  request: ReturnType<typeof getProfileAddressAction>;
  onClose: () => void;
}>) {
  const [address, setAddress] = useState<ProfileAddressDTO | null>(null);
  const [locationStep, setLocationStep] = useState(false);
  const [lngLat, setLngLat] = useState<readonly [number, number]>([0, 0]);
  const [location, setLocation] = useState<ReverseGeocodedLocationDTO | undefined>();
  const formRef = useRef<FormHandle<CreateProfileAddressInput>>(null);
  const [isPending, startTransition] = useTransition();
  const handleResolved = useCallback(
    (result: Awaited<ReturnType<typeof getProfileAddressAction>>) => {
      if (!result?.isSuccess) return;
      const data = result.data as ProfileAddressDTO;
      setAddress(data);
      setLngLat([data.latLng[1], data.latLng[0]]);
    },
    [],
  );
  const submit = (input: CreateProfileAddressInput) =>
    startTransition(async () => {
      const result = await updateProfileAddressAction({ addressId, ...input });
      if (!result)
        return globalErrorHandler({
          isSuccess: false,
          message: 'ویرایش نشانی انجام نشد.',
          data: { messages: {}, details: {} },
        });
      if (!result.isSuccess)
        return globalErrorHandler(result, { showErrorFields: formRef.current?.setError });
      toast.add({ type: 'success', title: result.message || 'نشانی با موفقیت ویرایش شد.' });
      onClose();
    });
  const continueToDetails = () => {
    startTransition(async () => {
      const result = await reverseGeocodeAction({ lat: lngLat[1], lng: lngLat[0] });
      if (result?.isSuccess) setLocation(result.data);
      setLocationStep(false);
    });
  };
  const current = lngLat;
  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <FormDialogContent
        formId={locationStep ? LOCATION_FORM_ID : DETAILS_FORM_ID}
        onClose={onClose}
        isLoading={isPending}
        submitText={locationStep ? 'ادامه' : 'ذخیره تغییرات'}
        title={locationStep ? 'موقعیت نشانی را ویرایش کنید' : 'ویرایش نشانی'}
        size="xl"
        headerAction={
          !locationStep && address ? (
            <Button type="button" variant="text" size="sm" onClick={() => setLocationStep(true)}>
              ویرایش موقعیت
            </Button>
          ) : undefined
        }
        contentClassName="tw:max-h-[70dvh] tw:overflow-y-auto"
      >
        {locationStep ? (
          <Form
            id={LOCATION_FORM_ID}
            handleSubmit={continueToDetails}
            options={{ defaultValues: { lngLat: current } }}
          >
            <fieldset className="tw:w-full tw:min-w-0">
              <DynamicMap
                lngLat={current}
                focusLngLat={current}
                initialProvinceTitle={address?.province}
                setLngLat={setLngLat}
              />
            </fieldset>
          </Form>
        ) : (
          <Suspense
            fallback={
              <CreateNewAddressDetailsFormBody
                formRef={formRef}
                handleSubmit={() => undefined}
                lngLat={current}
                formId={DETAILS_FORM_ID}
                isSkeleton
              />
            }
          >
            <AsyncContent request={request} onResolved={handleResolved}>
              {(result) =>
                result?.isSuccess ? (
                  <CreateNewAddressDetailsFormBody
                    formRef={formRef}
                    handleSubmit={submit}
                    lngLat={lngLat}
                    address={result.data as ProfileAddressDTO}
                    location={location}
                    formId={DETAILS_FORM_ID}
                    isPending={isPending}
                  />
                ) : (
                  <p role="alert">{result?.message}</p>
                )
              }
            </AsyncContent>
          </Suspense>
        )}
      </FormDialogContent>
    </Dialog>
  );
}
