import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { FieldErrorHint } from './field-error-hint';

describe('FieldErrorHint', () => {
  it('keeps a persistent described-by target and displays the hint by default', () => {
    render(
      <FieldErrorHint
        id="pet-name-description"
        hint="نام حیوان را وارد کنید."
        className="tw:text-xs"
        textClassName="tw:text-muted-foreground"
      />,
    );

    const hint = screen.getByText('نام حیوان را وارد کنید.');
    expect(hint.parentElement?.id).toBe('pet-name-description');
    expect(hint.parentElement?.getAttribute('role')).toBeNull();
    expect(hint.className).toContain('tw:text-muted-foreground');
  });

  it('replaces a hint with the validation message and exposes it as an alert', () => {
    render(
      <FieldErrorHint
        id="pet-name-description"
        hint="نام حیوان را وارد کنید."
        error="نام حیوان الزامی است."
        invalid
        textClassName="tw:text-muted-foreground"
      />,
    );

    const error = screen.getByRole('alert');
    expect(error.id).toBe('pet-name-description');
    expect(error.textContent).toContain('نام حیوان الزامی است.');
    expect(error.textContent).not.toContain('نام حیوان را وارد کنید.');
    expect(error.firstElementChild?.className).toContain('tw:text-error');
  });
});
