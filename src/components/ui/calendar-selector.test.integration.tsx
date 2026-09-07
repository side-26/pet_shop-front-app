import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CalendarSelector } from './calendar-selector';

afterEach(cleanup);

describe('CalendarSelector', () => {
  const items = Array.from({ length: 300 }, (_, index) => ({ value: index, label: String(index) }));

  it('opens at the current value and commits keyboard navigation only on confirmation', () => {
    const onValueChange = vi.fn();
    render(
      <CalendarSelector
        items={items}
        value={150}
        label="سال"
        color="warning"
        onValueChange={onValueChange}
      />,
    );
    const trigger = screen.getByRole('button', { name: 'سال' });
    expect(trigger.getAttribute('data-color')).toBe('warning');
    expect(trigger.className).toContain('tw:w-[95px]');
    fireEvent.click(trigger);
    expect(screen.getByText('سال')).toBeTruthy();
    const listbox = screen.getByRole('listbox', { name: 'سال' });
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.keyDown(listbox, { key: 'Enter' });
    expect(onValueChange).toHaveBeenCalledWith(151);
  });

  it('does not select a disabled item', () => {
    const onValueChange = vi.fn();
    render(
      <CalendarSelector
        items={[{ value: 1, label: '۱', disabled: true }]}
        value={1}
        label="ماه"
        onValueChange={onValueChange}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'ماه' }));
    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Enter' });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
