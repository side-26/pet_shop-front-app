'use client';

import { useRef, useState } from 'react';
import { AtSignIcon, LockKeyholeIcon, PawPrintIcon, PhoneIcon, SearchIcon } from 'lucide-react';
import * as yup from 'yup';

import { Button } from '@/components/ui/button';
import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { Checkbox } from '@/components/ui/fields/checkbox';
import { CheckboxField } from '@/components/ui/fields/checkbox-field';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/fields/input-group';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';
import { RadioGroupField } from '@/components/ui/fields/radio-group-field';
import { SelectField } from '@/components/ui/fields/select-field';
import { Switch } from '@/components/ui/fields/switch';
import { SwitchField } from '@/components/ui/fields/switch-field';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form, type FormHandle } from '@/components/ui/form';

import { ShowcaseSection } from './showcase-section';

const profileSchema = yup.object({
  email: yup.string().email('نشانی ایمیل معتبر نیست.').required('ایمیل الزامی است.'),
  petName: yup.string().min(2, 'نام باید حداقل دو نویسه باشد.').required('نام حیوان الزامی است.'),
  password: yup
    .string()
    .min(8, 'کلمه عبور باید حداقل هشت نویسه باشد.')
    .required('کلمه عبور الزامی است.'),
  phoneNumber: yup.string().required('شماره موبایل الزامی است.'),
});

type ProfileFormValues = yup.InferType<typeof profileSchema>;

const inputColors = ['primary', 'secondary', 'info', 'success', 'warning', 'error'] as const;
const inputSizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const;
const petTypeOptions = [
  { label: 'سگ', value: 'dog' },
  { label: 'گربه', value: 'cat' },
  { label: 'پرنده', value: 'bird' },
];

export function FormShowcase() {
  const formRef = useRef<FormHandle<ProfileFormValues>>(null);
  const [submittedName, setSubmittedName] = useState<string>();

  return (
    <ShowcaseSection
      id="forms"
      title="Form"
      description="فرم React Hook Form، تمام کنترل‌های فیلد، و Text Field در رنگ‌ها و اندازه‌های پشتیبانی‌شده."
    >
      <Form<ProfileFormValues>
        ref={formRef}
        validationSchema={profileSchema}
        options={{
          defaultValues: { email: '', petName: '', password: '', phoneNumber: '' },
          mode: 'onBlur',
        }}
        handleSubmit={(values) => setSubmittedName(values.petName)}
        className="tw:max-w-xl"
      >
        {({ formState: { isSubmitting } }) => (
          <>
            <TextField<ProfileFormValues>
              name="petName"
              label="نام حیوان"
              hint="نامی که در پرونده حیوان ثبت شده است."
              prefixIcon={<PawPrintIcon />}
              size="lg"
              color="success"
            />
            <TextField<ProfileFormValues>
              name="email"
              label="ایمیل سرپرست"
              hint="نمونه: owner@example.com"
              prefixIcon={<AtSignIcon />}
              type="email"
              dir="ltr"
              color="info"
            />
            <TextField<ProfileFormValues>
              name="password"
              label="کلمه عبور"
              hint="حداقل هشت نویسه"
              prefixIcon={<LockKeyholeIcon />}
              type="password"
              color="warning"
            />
            <TextField<ProfileFormValues>
              name="phoneNumber"
              label="شماره موبایل"
              hint="مقدار چپ‌به‌راست و جای‌نگهدار راست‌به‌چپ است."
              prefixIcon={<PhoneIcon />}
              type="tel"
              inputMode="tel"
              placeholder="شماره موبایل"
              color="primary"
            />
            <div className="tw:flex tw:flex-wrap tw:gap-2">
              <Button type="submit" isLoading={isSubmitting} loadingText="در حال ثبت">
                ثبت
              </Button>
              <Button
                type="button"
                variant="outlined"
                color="error"
                onClick={() => formRef.current?.reset()}
              >
                پاک‌کردن
              </Button>
              <Button
                type="button"
                variant="tonal"
                onClick={() =>
                  formRef.current?.setValue('petName', 'میشا', { shouldValidate: true })
                }
              >
                نمونه imperative
              </Button>
            </div>
            {submittedName && (
              <p role="status" className="tw:text-body-m tw:text-success">
                اطلاعات {submittedName} ثبت شد.
              </p>
            )}
          </>
        )}
      </Form>

      <Form<Record<string, string>> handleSubmit={() => undefined}>
        <div className="tw:flex tw:flex-col tw:gap-4">
          <h4 className="tw:text-heading-4">رنگ‌های TextField</h4>
          <div className="tw:grid tw:gap-3 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
            {inputColors.map((color) => (
              <TextField<Record<string, string>>
                key={color}
                name={`color-${color}`}
                label={color}
                hint={`Semantic ${color} state`}
                color={color}
                prefixIcon={<PawPrintIcon />}
                postfixIcon={<AtSignIcon />}
                dir="ltr"
              />
            ))}
          </div>
        </div>
        <div className="tw:flex tw:flex-col tw:gap-4">
          <h4 className="tw:text-heading-4">اندازه‌های TextField</h4>
          <div className="tw:grid tw:items-start tw:gap-3 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
            {inputSizes.map((size) => (
              <TextField<Record<string, string>>
                key={size}
                name={`size-${size}`}
                label={`اندازه ${size}`}
                hint="متن راهنما"
                size={size}
                placeholder={size}
              />
            ))}
          </div>
        </div>
      </Form>

      <div className="tw:flex tw:flex-col tw:gap-4">
        <h4 className="tw:text-heading-4">TextareaField</h4>
        <Form<Record<string, string>> handleSubmit={() => undefined}>
          <div className="tw:grid tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
            {inputColors.map((color) => (
              <TextareaField<Record<string, string>>
                key={color}
                name={`textarea-${color}`}
                label={color}
                hint="یادداشت مراقبت از حیوان"
                color={color}
                size={color === 'primary' ? 'sm' : 'md'}
                prefixIcon={<PawPrintIcon />}
                postfixIcon={<AtSignIcon />}
                counter
                maxLength={160}
                placeholder="توضیحات را وارد کنید"
              />
            ))}
          </div>
          <TextareaField<Record<string, string>>
            name="textarea-large"
            label="توضیحات کامل"
            hint="حداکثر ۳۰۰ نویسه"
            size="xl"
            color="info"
            counter
            maxLength={300}
            className="tw:max-w-xl"
          />
        </Form>
      </div>

      <div className="tw:flex tw:flex-col tw:gap-4">
        <h4 className="tw:text-heading-4">اندازه‌های TextareaField</h4>
        <Form<Record<string, string>> handleSubmit={() => undefined}>
          <div className="tw:grid tw:items-start tw:gap-3 tw:sm:grid-cols-2 tw:lg:grid-cols-3">
            {inputSizes.map((size) => (
              <TextareaField<Record<string, string>>
                key={size}
                name={`textarea-size-${size}`}
                label={`اندازه ${size}`}
                hint="متن راهنما"
                size={size}
                placeholder={size}
              />
            ))}
          </div>
        </Form>
      </div>

      <div className="tw:grid tw:gap-6 tw:md:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="form-search">جست‌وجوی پرونده</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput id="form-search" placeholder="نام یا کد پرونده" />
          </InputGroup>
        </Field>
        <Form<Record<string, string>>
          handleSubmit={() => undefined}
          options={{ defaultValues: { petType: '' } }}
        >
          <SelectField
            name="petType"
            label="نوع حیوان در فرم"
            hint="انتخاب شما در React Hook Form ذخیره می‌شود."
            rules={{ required: 'انتخاب نوع حیوان الزامی است.' }}
            options={petTypeOptions}
            contentClassName="tw:max-h-36 tw:overflow-y-auto"
          />
          <SelectField
            name="empty-pet-type"
            label="نوع حیوان بدون گزینه"
            options={[]}
            emptyText="نوع حیوانی برای انتخاب وجود ندارد."
          />
          <Button type="submit">بررسی انتخاب</Button>
        </Form>
      </div>

      <div className="tw:grid tw:gap-6 tw:md:grid-cols-3">
        <Field className="tw:flex-row tw:items-center">
          <Checkbox id="form-newsletter" defaultChecked />
          <FieldLabel htmlFor="form-newsletter">دریافت خبرنامه</FieldLabel>
        </Field>
        <Field className="tw:flex-row tw:items-center tw:justify-between">
          <FieldLabel htmlFor="form-notifications">اعلان سفارش</FieldLabel>
          <Switch id="form-notifications" defaultChecked />
        </Field>
        <RadioGroup name="form-contact" defaultValue="phone" aria-label="روش تماس">
          <Field className="tw:flex-row tw:items-center">
            <RadioGroupItem id="form-contact-phone" value="phone" />
            <FieldLabel htmlFor="form-contact-phone">تماس تلفنی</FieldLabel>
          </Field>
          <Field className="tw:flex-row tw:items-center">
            <RadioGroupItem id="form-contact-email" value="email" />
            <FieldLabel htmlFor="form-contact-email">ایمیل</FieldLabel>
          </Field>
        </RadioGroup>
      </div>

      <div className="tw:flex tw:flex-col tw:gap-4">
        <h4 className="tw:text-heading-4">Selection variants and dual colors</h4>
        <Form<{ terms: boolean; alerts: boolean; contact: string }>
          handleSubmit={() => undefined}
          options={{ defaultValues: { terms: false, alerts: true, contact: '' } }}
          className="tw:grid tw:gap-5 tw:md:grid-cols-3"
        >
          <CheckboxField
            name="terms"
            label="پذیرش قوانین"
            hint="برای ادامه قوانین را تأیید کنید."
            rules={{ required: 'پذیرش قوانین الزامی است.' }}
            variant="tonal"
            checkedColor="success"
            uncheckedColor="warning"
            size="lg"
          />
          <SwitchField
            name="alerts"
            label="اعلان سفارش‌ها"
            hint="وضعیت اعلان‌ها در فرم ذخیره می‌شود."
            variant="outlined"
            checkedColor="info"
            uncheckedColor="error"
            size="lg"
          />
          <RadioGroupField
            name="contact"
            label="روش تماس"
            hint="یک روش تماس انتخاب کنید."
            rules={{ required: 'انتخاب روش تماس الزامی است.' }}
            options={[
              { value: 'phone', label: 'تماس تلفنی' },
              { value: 'email', label: 'ایمیل' },
            ]}
            variant="fill"
            checkedColor="primary"
            uncheckedColor="secondary"
            size="lg"
          />
          <Button type="submit" className="tw:md:col-span-3">
            بررسی خطاهای فیلد
          </Button>
        </Form>
        <div className="tw:grid tw:gap-5 tw:md:grid-cols-3">
          {(['fill', 'outlined', 'tonal'] as const).map((variant) => (
            <div key={variant} className="tw:flex tw:flex-col tw:gap-3">
              <p className="tw:text-label-l">{variant}</p>
              <Field className="tw:flex-row tw:items-center">
                <Checkbox
                  id={`checkbox-${variant}`}
                  variant={variant}
                  checkedColor="success"
                  uncheckedColor="warning"
                  defaultChecked
                />
                <FieldLabel htmlFor={`checkbox-${variant}`}>Checkbox</FieldLabel>
              </Field>
              <Field className="tw:flex-row tw:items-center tw:justify-between">
                <FieldLabel htmlFor={`switch-${variant}`}>Switch</FieldLabel>
                <Switch
                  id={`switch-${variant}`}
                  variant={variant}
                  checkedColor="info"
                  uncheckedColor="error"
                />
              </Field>
              <RadioGroup defaultValue="selected" aria-label={`Radio ${variant}`}>
                <Field className="tw:flex-row tw:items-center">
                  <RadioGroupItem
                    value="selected"
                    variant={variant}
                    checkedColor="primary"
                    uncheckedColor="secondary"
                    aria-label={`${variant} selected`}
                  />
                  <span className="tw:text-body-m">انتخاب‌شده</span>
                </Field>
                <Field className="tw:flex-row tw:items-center">
                  <RadioGroupItem
                    value="idle"
                    variant={variant}
                    checkedColor="primary"
                    uncheckedColor="warning"
                    aria-label={`${variant} idle`}
                  />
                  <span className="tw:text-body-m">انتخاب‌نشده</span>
                </Field>
              </RadioGroup>
            </div>
          ))}
        </div>
        <div className="tw:flex tw:flex-wrap tw:gap-6 tw:rounded-2xl tw:bg-muted tw:p-4">
          <Field data-disabled className="tw:w-auto tw:flex-row tw:items-center">
            <Checkbox id="checkbox-disabled-neutral" defaultChecked disabled />
            <FieldLabel htmlFor="checkbox-disabled-neutral">غیرفعال</FieldLabel>
          </Field>
          <Field className="tw:w-auto tw:flex-row tw:items-center tw:gap-3">
            <Switch id="switch-readonly-neutral" defaultChecked readOnly />
            <FieldLabel htmlFor="switch-readonly-neutral">وضعیت فقط‌خواندنی</FieldLabel>
          </Field>
          <Field className="tw:w-auto tw:flex-row tw:items-center tw:gap-3">
            <Switch id="switch-loading" defaultChecked loading />
            <FieldLabel htmlFor="switch-loading">در حال به‌روزرسانی</FieldLabel>
          </Field>
          <RadioGroup defaultValue="locked" readOnly aria-label="نمونه فقط‌خواندنی">
            <RadioGroupItem value="locked" aria-label="رادیوی فقط‌خواندنی" />
          </RadioGroup>
        </div>
        <div className="tw:flex tw:flex-col tw:gap-4">
          <p className="tw:text-label-l">اندازه کنترل و متن برچسب</p>
          <div className="tw:grid tw:items-start tw:gap-4 tw:sm:grid-cols-2 tw:lg:grid-cols-5">
            {inputSizes.map((size) => (
              <div key={size} className="tw:flex tw:flex-col tw:gap-3">
                <Field className="tw:flex-row tw:items-center">
                  <Checkbox id={`checkbox-size-${size}`} size={size} defaultChecked />
                  <FieldLabel htmlFor={`checkbox-size-${size}`}>{size}</FieldLabel>
                </Field>
                <Field className="tw:flex-row tw:items-center tw:justify-between">
                  <FieldLabel htmlFor={`switch-size-${size}`}>{size}</FieldLabel>
                  <Switch id={`switch-size-${size}`} size={size} defaultChecked />
                </Field>
                <Field className="tw:flex-row tw:items-center">
                  <RadioGroup defaultValue="selected" aria-label={`اندازه ${size}`}>
                    <RadioGroupItem
                      id={`radio-size-${size}`}
                      value="selected"
                      size={size}
                      aria-label={`رادیو ${size}`}
                    />
                  </RadioGroup>
                  <FieldLabel htmlFor={`radio-size-${size}`}>{size}</FieldLabel>
                </Field>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ShowcaseSection>
  );
}
