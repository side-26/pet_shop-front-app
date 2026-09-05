'use client';

import type { Content, JSONContent } from '@tiptap/core';
import { EditorContent, useEditor } from '@tiptap/react';
import { Suspense, type ReactNode, useMemo } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

import { cn } from '@/lib/utils';

import {
  createTipTapExtensions,
  tipTapTypographyClassName,
  type TipTapTextDirection,
} from './plugins';
import {
  TipTapActionsContext,
  type TipTapActionColor,
  type TipTapActionVariant,
} from './plugins/actions/context';
import styles from './styles.module.css';

const tipTapVariants = tv({
  base: [
    'tw:w-full tw:overflow-hidden tw:rounded-xl tw:border tw:shadow-xs tw:transition-[background-color,border-color,color,box-shadow] tw:duration-150 tw:ease-out',
    'tw:has-[.tiptap:focus-visible]:ring-3 tw:motion-reduce:transition-none',
  ],
  variants: {
    variant: {
      fill: 'tw:border-transparent',
      tonal: 'tw:border-transparent',
      outlined: 'tw:bg-background',
    },
    color: {
      primary:
        'tw:has-[.tiptap:focus-visible]:border-primary tw:has-[.tiptap:focus-visible]:ring-primary/20',
      secondary:
        'tw:has-[.tiptap:focus-visible]:border-secondary tw:has-[.tiptap:focus-visible]:ring-secondary/20',
      error:
        'tw:has-[.tiptap:focus-visible]:border-error tw:has-[.tiptap:focus-visible]:ring-error/20',
      success:
        'tw:has-[.tiptap:focus-visible]:border-success tw:has-[.tiptap:focus-visible]:ring-success/20',
    },
  },
  compoundVariants: [
    { variant: 'fill', color: 'primary', class: 'tw:bg-primary tw:text-primary-foreground' },
    {
      variant: 'fill',
      color: 'secondary',
      class: 'tw:bg-secondary tw:text-secondary-foreground',
    },
    { variant: 'fill', color: 'error', class: 'tw:bg-error tw:text-error-foreground' },
    { variant: 'fill', color: 'success', class: 'tw:bg-success tw:text-success-foreground' },
    {
      variant: 'tonal',
      color: 'primary',
      class: 'tw:bg-primary-muted tw:text-primary-muted-foreground',
    },
    {
      variant: 'tonal',
      color: 'secondary',
      class: 'tw:bg-secondary-muted tw:text-secondary-muted-foreground',
    },
    {
      variant: 'tonal',
      color: 'error',
      class: 'tw:bg-error-muted tw:text-error-muted-foreground',
    },
    {
      variant: 'tonal',
      color: 'success',
      class: 'tw:bg-success-muted tw:text-success-muted-foreground',
    },
    {
      variant: 'outlined',
      color: 'primary',
      class: 'tw:border-primary tw:text-foreground tw:caret-primary',
    },
    {
      variant: 'outlined',
      color: 'secondary',
      class: 'tw:border-secondary tw:text-foreground tw:caret-secondary',
    },
    {
      variant: 'outlined',
      color: 'error',
      class: 'tw:border-error tw:text-foreground tw:caret-error',
    },
    {
      variant: 'outlined',
      color: 'success',
      class: 'tw:border-success tw:text-foreground tw:caret-success',
    },
  ],
  defaultVariants: { color: 'primary', variant: 'fill' },
});

type TipTapProps = Omit<VariantProps<typeof tipTapVariants>, 'color' | 'variant'> & {
  ariaLabel?: string;
  className?: string;
  color?: TipTapActionColor;
  content?: Content;
  editable?: boolean;
  headerActions?: ReactNode;
  onChange?: (content: JSONContent) => void;
  textDirection?: TipTapTextDirection;
  variant?: TipTapActionVariant;
};

function TipTap({
  ariaLabel = 'ویرایشگر متن',
  className,
  color = 'primary',
  variant = 'fill',
  ...props
}: TipTapProps) {
  return (
    <Suspense
      fallback={
        <TipTapContainer
          ariaLabel={ariaLabel}
          className={className}
          color={color}
          isLoading
          variant={variant}
        >
          <span aria-hidden className={styles.fallback} />
        </TipTapContainer>
      }
    >
      <TipTapEditor
        {...props}
        ariaLabel={ariaLabel}
        className={className}
        color={color}
        variant={variant}
      />
    </Suspense>
  );
}

type TipTapContainerProps = Pick<
  TipTapProps,
  'ariaLabel' | 'className' | 'color' | 'editable' | 'variant'
> & {
  children: ReactNode;
  isLoading?: boolean;
};

function TipTapContainer({
  ariaLabel,
  children,
  className,
  color = 'primary',
  editable = true,
  isLoading = false,
  variant = 'fill',
}: TipTapContainerProps) {
  return (
    <div
      aria-busy={isLoading || undefined}
      aria-label={ariaLabel}
      data-color={color}
      data-readonly={!editable || undefined}
      data-slot="tip-tap"
      data-variant={variant}
      className={cn(
        tipTapVariants({ color, variant }),
        tipTapTypographyClassName,
        styles.root,
        className,
      )}
    >
      {children}
    </div>
  );
}

function TipTapEditor({
  ariaLabel = 'ویرایشگر متن',
  className,
  content,
  editable = true,
  headerActions,
  onChange,
  color = 'primary',
  textDirection = 'auto',
  variant = 'fill',
}: TipTapProps) {
  // The hook API keeps this small, standalone editor self-contained.
  const extensions = useMemo(() => createTipTapExtensions(), []);
  const editor = useEditor(
    {
      immediatelyRender: false,
      shouldRerenderOnTransaction: false,
      content,
      editable,
      extensions,
      textDirection,
      editorProps: {
        attributes: {
          'aria-label': ariaLabel,
          'aria-multiline': 'true',
          role: 'textbox',
        },
      },
      onUpdate: ({ editor: updatedEditor }) => onChange?.(updatedEditor.getJSON()),
    },
    [textDirection],
  );

  return (
    <TipTapContainer
      ariaLabel={ariaLabel}
      className={className}
      color={color}
      editable={editable}
      variant={variant}
    >
      {headerActions ? (
        <TipTapActionsContext.Provider value={{ color, editable, editor, variant }}>
          {headerActions}
        </TipTapActionsContext.Provider>
      ) : null}
      <EditorContent editor={editor} />
    </TipTapContainer>
  );
}

export { TipTap, tipTapVariants, type TipTapProps };
