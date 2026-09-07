import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useWatch } from 'react-hook-form';

import { Form } from './form';
import { RangedDatePicker, type RangedDatePickerValue } from './ranged-date-picker';

type Values = RangedDatePickerValue;
const defaultValue = { from: '2026-09-01T00:00:00.000Z', to: '2026-09-07T23:59:59.000Z' };

function ValueProbe() {
  const values = useWatch<Values>();
  return <output aria-label="مقادیر بازه">{JSON.stringify(values)}</output>;
}

afterEach(cleanup);

describe('RangedDatePicker', () => {
  it('commits a complete range only after confirmation and restores trigger focus', async () => {
    const onValueChange = vi.fn();
    render(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: defaultValue }}>
        <RangedDatePicker<Values> label="بازه گزارش" onValueChange={onValueChange} />
      </Form>,
    );

    const trigger = screen.getByRole('button', { name: 'بازه گزارش' });
    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'امروز' }));
    fireEvent.click(screen.getByRole('button', { name: 'لغو' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await act(async () => undefined);
    expect(document.activeElement).toBe(trigger);

    fireEvent.click(trigger);
    fireEvent.click(screen.getByRole('button', { name: 'امروز' }));
    fireEvent.click(screen.getByRole('button', { name: 'تأیید' }));
    expect(onValueChange).toHaveBeenCalledOnce();
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('opens complete time controls immediately without mutating empty form values', () => {
    render(
      <Form<Values>
        handleSubmit={() => undefined}
        options={{ defaultValues: { from: '', to: '' } }}
      >
        <RangedDatePicker<Values> label="بازه زمان‌دار" hasTime />
        <ValueProbe />
      </Form>,
    );

    const serializedEmptyRange = JSON.stringify({ from: '', to: '' });
    expect(screen.getByRole('status', { name: 'مقادیر بازه' }).textContent).toBe(
      serializedEmptyRange,
    );
    fireEvent.click(screen.getByRole('button', { name: 'بازه زمان‌دار' }));
    expect(screen.getByRole('dialog', { name: 'انتخاب بازه تاریخ' })).toBeTruthy();
    expect(screen.queryByRole('status', { name: 'در حال آماده‌سازی تقویم' })).toBeNull();
    expect(screen.getByRole('group', { name: 'زمان شروع' })).toBeTruthy();
    expect(screen.getByRole('group', { name: 'زمان پایان' })).toBeTruthy();
    expect(screen.getByRole('status', { name: 'مقادیر بازه' }).textContent).toBe(
      serializedEmptyRange,
    );
  });

  it('disables the trigger when requested', () => {
    render(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: defaultValue }}>
        <RangedDatePicker<Values> label="بازه غیرفعال" disabled />
      </Form>,
    );
    expect(screen.getByRole('button', { name: 'بازه غیرفعال' }).hasAttribute('disabled')).toBe(
      true,
    );
  });
});
