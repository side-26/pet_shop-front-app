import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { DatePicker, formatJalaliDateTime, normalizeIsoDateTime } from './date-picker';
import { Form } from './form';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const defaultValue = '2026-09-07T05:34:56.000Z';
type Values = { scheduledAt: string };

function renderDatePicker(
  datePicker: React.ReactNode,
  handleSubmit: (values: Values) => void = () => undefined,
) {
  return render(
    <Form<Values> handleSubmit={handleSubmit}>
      {datePicker}
      <button type="submit">ثبت</button>
    </Form>,
  );
}

describe('DatePicker', () => {
  it('formats Jalali display values and normalizes ISO datetime values', () => {
    expect(formatJalaliDateTime(new Date(defaultValue), 'UTC')).toBe('16/06/1405 05:34:56');
    expect(normalizeIsoDateTime('2026-09-07T09:04:56+03:30')).toBe(defaultValue);
    expect(normalizeIsoDateTime('16/06/1405 09:04:56')).toBeUndefined();
  });

  it('shows the default ISO value as Jalali text without rendering an input', async () => {
    const { container } = renderDatePicker(
      <DatePicker<Values>
        defaultValue={defaultValue}
        name="scheduledAt"
        label="زمان ارسال"
        hint="تاریخ و زمان تحویل را انتخاب کنید."
        color="warning"
        size="xl"
      />,
    );

    expect(container.querySelector('input')).toBeNull();
    expect(screen.getByRole('button', { name: 'زمان ارسال' }).getAttribute('data-color')).toBe(
      'warning',
    );
    expect(screen.getByRole('button', { name: 'زمان ارسال' }).getAttribute('data-size')).toBe('xl');
    expect(screen.getByRole('button', { name: 'زمان ارسال' }).className).toContain(
      'tw:items-center',
    );
    const icon = container.querySelector<HTMLElement>('[data-slot="date-picker-icon"]');
    expect(icon?.className).toContain('tw:text-warning-active');
    expect(icon?.className).toContain('tw:size-5');
    expect(screen.getByText('زمان ارسال').className).toContain('tw:text-warning-active');
    expect(screen.getByText('تاریخ و زمان تحویل را انتخاب کنید.')).toBeTruthy();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'زمان ارسال' }).textContent).toContain(
        formatJalaliDateTime(new Date(defaultValue)),
      ),
    );
  });

  it('initializes an omitted default value in React Hook Form to the current datetime', async () => {
    const earliestExpectedTime = Date.now();
    const handleSubmit = vi.fn();
    renderDatePicker(<DatePicker<Values> name="scheduledAt" label="تاریخ و زمان" />, handleSubmit);

    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'تاریخ و زمان' }).textContent).not.toContain(
        'DD/MM/YYYY',
      ),
    );
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));
    await waitFor(() => expect(handleSubmit).toHaveBeenCalled());

    const initializedValue = handleSubmit.mock.calls[0]?.[0].scheduledAt ?? '';
    const initializedTime = new Date(initializedValue).getTime();
    expect(initializedTime).toBeGreaterThanOrEqual(earliestExpectedTime);
    expect(initializedTime).toBeLessThanOrEqual(Date.now());
    expect(screen.getByRole('button', { name: 'تاریخ و زمان' }).textContent).toContain(
      formatJalaliDateTime(new Date(initializedValue)),
    );
  });

  it('commits today only after confirmation and preserves cancel semantics', async () => {
    const now = new Date('2026-09-08T01:02:03.000Z');
    vi.useFakeTimers();
    vi.setSystemTime(now);
    const onValueChange = vi.fn();
    const handleSubmit = vi.fn();
    renderDatePicker(
      <DatePicker<Values>
        defaultValue={defaultValue}
        name="scheduledAt"
        label="تاریخ و زمان"
        onValueChange={onValueChange}
      />,
      handleSubmit,
    );
    const openButton = screen.getByRole('button', { name: 'تاریخ و زمان' });

    fireEvent.click(openButton);
    expect(
      screen
        .getAllByRole('button')
        .filter((button) => ['تأیید', 'امروز', 'لغو'].includes(button.textContent ?? ''))
        .map((button) => button.textContent),
    ).toEqual(['تأیید', 'امروز', 'لغو']);
    fireEvent.click(screen.getByRole('button', { name: 'امروز' }));
    fireEvent.click(screen.getByRole('button', { name: 'لغو' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'ثبت' })));
    expect(handleSubmit).toHaveBeenLastCalledWith({ scheduledAt: defaultValue }, expect.anything());

    fireEvent.click(openButton);
    fireEvent.click(screen.getByRole('button', { name: 'امروز' }));
    fireEvent.click(screen.getByRole('button', { name: 'تأیید' }));
    expect(onValueChange).toHaveBeenLastCalledWith(now.toISOString());
    await act(async () => fireEvent.click(screen.getByRole('button', { name: 'ثبت' })));
    expect(handleSubmit).toHaveBeenLastCalledWith(
      { scheduledAt: now.toISOString() },
      expect.anything(),
    );
  });

  it('lazy-loads the time selector when hasTime and commits its draft time', async () => {
    const onValueChange = vi.fn();
    renderDatePicker(
      <DatePicker<Values>
        defaultValue={defaultValue}
        name="scheduledAt"
        label="تاریخ و زمان"
        hasTime
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'تاریخ و زمان' }));
    const hoursButton = await screen.findByRole('button', { name: 'ساعت' });
    const initialDate = new Date(defaultValue);
    expect(hoursButton.textContent).toBe(String(initialDate.getHours()).padStart(2, '0'));

    fireEvent.click(hoursButton);
    const hoursListbox = screen.getByRole('listbox', { name: 'ساعت' });
    fireEvent.keyDown(hoursListbox, { key: 'ArrowDown' });
    fireEvent.keyDown(hoursListbox, { key: 'Enter' });
    fireEvent.click(screen.getByRole('button', { name: 'تأیید' }));

    const expectedDate = new Date(defaultValue);
    expectedDate.setHours(
      expectedDate.getHours() + 1,
      expectedDate.getMinutes(),
      expectedDate.getSeconds(),
      0,
    );
    expect(onValueChange).toHaveBeenCalledWith(expectedDate.toISOString());
  });

  it('does not render the time selector unless hasTime is enabled', () => {
    renderDatePicker(
      <DatePicker<Values> defaultValue={defaultValue} name="scheduledAt" label="تاریخ" />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'تاریخ' }));
    expect(screen.queryByRole('button', { name: 'ساعت' })).toBeNull();
  });

  it('prevents opening when disabled', () => {
    renderDatePicker(
      <DatePicker<Values>
        defaultValue={defaultValue}
        name="scheduledAt"
        label="تاریخ و زمان"
        disabled
      />,
    );

    expect(screen.getByRole('button', { name: 'تاریخ و زمان' }).hasAttribute('disabled')).toBe(
      true,
    );
  });

  it('shows a persistent hint and replaces it with the React Hook Form error', async () => {
    renderDatePicker(
      <DatePicker<Values>
        defaultValue={defaultValue}
        name="scheduledAt"
        label="زمان ارسال"
        hint="یک تاریخ را انتخاب کنید."
        rules={{ validate: () => 'تاریخ انتخاب‌شده معتبر نیست.' }}
      />,
    );

    expect(screen.getByText('یک تاریخ را انتخاب کنید.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'ثبت' }));
    expect((await screen.findByRole('alert')).textContent).toBe('تاریخ انتخاب‌شده معتبر نیست.');
    expect(screen.getByRole('button', { name: 'زمان ارسال' }).getAttribute('data-invalid')).toBe(
      'true',
    );
    expect(
      screen
        .getByRole('button', { name: 'زمان ارسال' })
        .querySelector('[data-slot="date-picker-icon"]')?.className,
    ).toContain('tw:text-error');
    expect(screen.getByText('زمان ارسال').className).toContain('tw:text-error');
  });
});
