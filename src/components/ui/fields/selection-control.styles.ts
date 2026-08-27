export type SelectionColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';
export type SelectionVariant = 'fill' | 'outlined' | 'tonal';
export type SelectionSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const fillChecked: Record<SelectionColor, string> = {
  primary:
    'tw:data-checked:border-primary tw:data-checked:bg-primary tw:data-checked:text-primary-foreground',
  secondary:
    'tw:data-checked:border-secondary tw:data-checked:bg-secondary tw:data-checked:text-secondary-foreground',
  info: 'tw:data-checked:border-info tw:data-checked:bg-info tw:data-checked:text-info-foreground',
  success:
    'tw:data-checked:border-success tw:data-checked:bg-success tw:data-checked:text-success-foreground',
  warning:
    'tw:data-checked:border-warning tw:data-checked:bg-warning tw:data-checked:text-warning-foreground',
  error:
    'tw:data-checked:border-error tw:data-checked:bg-error tw:data-checked:text-error-foreground',
};
const fillUnchecked: Record<SelectionColor, string> = {
  primary:
    'tw:not-data-checked:border-primary tw:not-data-checked:bg-primary tw:not-data-checked:text-primary-foreground',
  secondary:
    'tw:not-data-checked:border-secondary tw:not-data-checked:bg-secondary tw:not-data-checked:text-secondary-foreground',
  info: 'tw:not-data-checked:border-info tw:not-data-checked:bg-info tw:not-data-checked:text-info-foreground',
  success:
    'tw:not-data-checked:border-success tw:not-data-checked:bg-success tw:not-data-checked:text-success-foreground',
  warning:
    'tw:not-data-checked:border-warning tw:not-data-checked:bg-warning tw:not-data-checked:text-warning-foreground',
  error:
    'tw:not-data-checked:border-error tw:not-data-checked:bg-error tw:not-data-checked:text-error-foreground',
};
const outlined: Record<SelectionColor, string> = {
  primary: 'tw:border-primary tw:text-primary',
  secondary: 'tw:border-secondary tw:text-secondary-active',
  info: 'tw:border-info tw:text-info',
  success: 'tw:border-success tw:text-success',
  warning: 'tw:border-warning tw:text-warning-active',
  error: 'tw:border-error tw:text-error',
};
const tonal: Record<SelectionColor, string> = {
  primary: 'tw:border-primary/25 tw:bg-primary-muted tw:text-primary-muted-foreground',
  secondary: 'tw:border-secondary/25 tw:bg-secondary-muted tw:text-secondary-muted-foreground',
  info: 'tw:border-info/25 tw:bg-info-muted tw:text-info-muted-foreground',
  success: 'tw:border-success/25 tw:bg-success-muted tw:text-success-muted-foreground',
  warning: 'tw:border-warning/25 tw:bg-warning-muted tw:text-warning-muted-foreground',
  error: 'tw:border-error/25 tw:bg-error-muted tw:text-error-muted-foreground',
};

export function selectionStateClasses(
  variant: SelectionVariant,
  checkedColor: SelectionColor,
  uncheckedColor: SelectionColor,
) {
  if (variant === 'fill') return `${fillChecked[checkedColor]} ${fillUnchecked[uncheckedColor]}`;
  const state = (classes: string, selector: 'data-checked' | 'not-data-checked') =>
    classes
      .split(' ')
      .map((item) => item.replace('tw:', `tw:${selector}:`))
      .join(' ');
  if (variant === 'outlined')
    return `tw:bg-background ${state(outlined[checkedColor], 'data-checked')} ${state(outlined[uncheckedColor], 'not-data-checked')}`;
  return `${state(tonal[checkedColor], 'data-checked')} ${state(tonal[uncheckedColor], 'not-data-checked')}`;
}

export function neutralInteractionClasses({ preserveReadOnlyColors = false } = {}) {
  return [
    'tw:disabled:border-disabled-border tw:disabled:bg-disabled tw:disabled:text-disabled-foreground',
    !preserveReadOnlyColors &&
      'tw:data-readonly:border-border tw:data-readonly:bg-muted tw:data-readonly:text-muted-foreground',
  ]
    .filter(Boolean)
    .join(' ');
}
