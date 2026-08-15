'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  forwardRef,
  useImperativeHandle,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from 'react';
import {
  FormProvider,
  useForm,
  type FieldValues,
  type SubmitErrorHandler,
  type SubmitHandler,
  type UseFormProps,
  type UseFormReturn,
} from 'react-hook-form';
import type { AnyObjectSchema } from 'yup';

import { cn } from '@/lib/utils';

type FormHandle<TFieldValues extends FieldValues = FieldValues> = UseFormReturn<TFieldValues>;

type FormProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  ComponentPropsWithoutRef<'form'>,
  'children' | 'onSubmit'
> & {
  children: ReactNode | ((methods: UseFormReturn<TFieldValues>) => ReactNode);
  handleSubmit: SubmitHandler<TFieldValues>;
  handleInvalid?: SubmitErrorHandler<TFieldValues>;
  options?: Omit<UseFormProps<TFieldValues>, 'resolver'>;
  validationSchema?: AnyObjectSchema;
};

function FormInner<TFieldValues extends FieldValues>(
  {
    children,
    className,
    handleInvalid,
    handleSubmit,
    noValidate = true,
    options,
    validationSchema,
    ...props
  }: FormProps<TFieldValues>,
  ref: Ref<FormHandle<TFieldValues>>,
) {
  const methods = useForm<TFieldValues>({
    ...options,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  });

  useImperativeHandle(ref, () => methods, [methods]);

  return (
    <FormProvider {...methods}>
      <form
        data-slot="form"
        className={cn('tw:flex tw:w-full tw:flex-col tw:gap-5', className)}
        noValidate={noValidate}
        onSubmit={methods.handleSubmit(handleSubmit, handleInvalid)}
        {...props}
      >
        {typeof children === 'function' ? children(methods) : children}
      </form>
    </FormProvider>
  );
}

const Form = forwardRef(FormInner) as <TFieldValues extends FieldValues = FieldValues>(
  props: FormProps<TFieldValues> & { ref?: Ref<FormHandle<TFieldValues>> },
) => ReactNode;

export { Form, type FormHandle, type FormProps };
