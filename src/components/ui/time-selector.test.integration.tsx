import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TimeSelector } from './time-selector';

afterEach(cleanup);

describe('TimeSelector', () => {
  it('renders a normalized default time and updates the selected segment', () => {
    const onValueChange = vi.fn();
    render(<TimeSelector defaultValue="09:08:07" onValueChange={onValueChange} />);

    expect(screen.getByRole('group', { name: 'زمان' }).getAttribute('data-align')).toBe('center');
    expect(screen.getByRole('button', { name: 'ساعت' }).textContent).toBe('09');
    expect(screen.getByRole('button', { name: 'دقیقه' }).textContent).toBe('08');
    expect(screen.getByRole('button', { name: 'ثانیه' }).textContent).toBe('07');

    fireEvent.click(screen.getByRole('button', { name: 'دقیقه' }));
    const listbox = screen.getByRole('listbox', { name: 'دقیقه' });
    fireEvent.keyDown(listbox, { key: 'ArrowDown' });
    fireEvent.keyDown(listbox, { key: 'Enter' });

    expect(onValueChange).toHaveBeenCalledWith('09:09:07');
    expect(screen.getByRole('button', { name: 'دقیقه' }).textContent).toBe('09');
  });

  it('supports controlled values, semantic variants, physical alignment, and disabled state', () => {
    render(
      <TimeSelector value="23:59:59" align="right" color="error" variant="outlined" disabled />,
    );

    const group = screen.getByRole('group', { name: 'زمان' });
    expect(group.getAttribute('data-color')).toBe('error');
    expect(group.getAttribute('data-variant')).toBe('outlined');
    expect(group.getAttribute('data-align')).toBe('right');
    expect(group.getAttribute('aria-disabled')).toBe('true');
    expect(screen.getAllByRole('button').every((button) => button.hasAttribute('disabled'))).toBe(
      true,
    );
  });

  it('accepts a JavaScript timestamp as its default value', () => {
    const timestamp = new Date(2026, 8, 7, 2, 22, 30).getTime();
    render(<TimeSelector defaultValue={timestamp} />);

    expect(screen.getByRole('button', { name: 'ساعت' }).textContent).toBe('02');
    expect(screen.getByRole('button', { name: 'دقیقه' }).textContent).toBe('22');
    expect(screen.getByRole('button', { name: 'ثانیه' }).textContent).toBe('30');
  });
});
