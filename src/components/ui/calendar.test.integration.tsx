import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Calendar, CalendarFooter } from './calendar';

afterEach(cleanup);

describe('Calendar', () => {
  it('renders the shared month and year selectors without native dropdown options', () => {
    const { container } = render(<Calendar mode="single" defaultMonth={new Date(2026, 8, 6)} />);

    expect(screen.getByRole('button', { name: 'ماه' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'سال' })).toBeTruthy();
    expect(container.querySelector('select')).toBeNull();
  });

  it('composes arbitrary footer children and forwards native properties', () => {
    render(
      <CalendarFooter aria-label="کنترل‌های تاریخ" data-testid="calendar-footer">
        <button type="button">تأیید</button>
        <span>توضیح</span>
      </CalendarFooter>,
    );

    const footer = screen.getByRole('group', { name: 'کنترل‌های تاریخ' });
    expect(footer.getAttribute('data-slot')).toBe('calendar-footer');
    expect(footer.getAttribute('data-testid')).toBe('calendar-footer');
    expect(screen.getByRole('button', { name: 'تأیید' })).toBeTruthy();
    expect(screen.getByText('توضیح')).toBeTruthy();
  });

  it('defaults an uncontrolled single selection to today and updates after a day click', () => {
    const today = new Date(2026, 8, 6);
    const onSelect = vi.fn();
    const { container } = render(
      <Calendar mode="single" defaultMonth={today} today={today} onSelect={onSelect} />,
    );
    const todayCell = container.querySelector('[data-today="true"]');
    const nextDayCell = container.querySelector(
      '[data-day]:not([data-today="true"]):not([data-outside="true"])',
    );
    const nextDayButton = nextDayCell?.querySelector('button');

    expect(todayCell?.getAttribute('data-selected')).toBe('true');
    expect(nextDayButton).toBeTruthy();

    fireEvent.click(nextDayButton!);

    expect(todayCell?.hasAttribute('data-selected')).toBe(false);
    expect(nextDayCell?.getAttribute('data-selected')).toBe('true');
    expect(onSelect).toHaveBeenCalledOnce();
  });

  it('preserves an explicit controlled single selection', () => {
    const today = new Date(2026, 8, 6);
    const selected = new Date(2026, 8, 8);
    const { container } = render(
      <Calendar mode="single" defaultMonth={today} today={today} selected={selected} />,
    );
    const todayCell = container.querySelector('[data-today="true"]');
    const selectedCell = container.querySelector('[data-selected="true"]');

    expect(todayCell?.hasAttribute('data-selected')).toBe(false);
    expect(selectedCell).toBeTruthy();
    expect(selectedCell).not.toBe(todayCell);
  });

  it('marks Fridays and additional holiday modifiers with an accessible red badge', () => {
    const friday = new Date(2026, 8, 11);
    const additionalHoliday = new Date(2026, 8, 8);
    const { container: defaultContainer } = render(
      <Calendar mode="single" defaultMonth={friday} />,
    );
    const defaultHolidayCount = Array.from(
      defaultContainer.querySelectorAll<HTMLElement>('[data-day]'),
    ).filter((cell) => cell.className.includes('tw:after:bg-error')).length;
    const { container } = render(
      <Calendar mode="single" defaultMonth={friday} modifiers={{ holiday: additionalHoliday }} />,
    );
    const holidayCells = Array.from(container.querySelectorAll<HTMLElement>('[data-day]')).filter(
      (cell) => cell.className.includes('tw:after:bg-error'),
    );

    expect(defaultHolidayCount).toBeGreaterThan(3);
    expect(holidayCells).toHaveLength(defaultHolidayCount + 1);
    for (const holidayCell of holidayCells) {
      expect(holidayCell.className).toContain('tw:after:top-1');
      expect(holidayCell.className).toContain('tw:after:left-1');
      expect(holidayCell.querySelector('button')?.getAttribute('aria-label')).toContain('تعطیل');
    }
  });
});
