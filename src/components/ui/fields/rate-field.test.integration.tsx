import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { RateField, rateFieldVariants } from './rate-field';

type Values = { rating: number };

afterEach(cleanup);

describe('RateField', () => {
  it('writes the clicked star count to React Hook Form and toggles the same rating off', async () => {
    const onSubmit = vi.fn();
    render(
      <Form<Values> handleSubmit={onSubmit} options={{ defaultValues: { rating: 0 } }}>
        <RateField<Values> name="rating" hint="امتیاز خود را انتخاب کنید." />
        <Button type="submit">ثبت امتیاز</Button>
      </Form>,
    );

    const thirdStar = screen.getByRole('button', { name: '3 ستاره' });
    fireEvent.click(thirdStar);
    expect(screen.getByRole('button', { name: '1 ستاره' }).getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(thirdStar.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('button', { name: '4 ستاره' }).getAttribute('aria-pressed')).toBe(
      'false',
    );

    fireEvent.click(screen.getByRole('button', { name: 'ثبت امتیاز' }));
    await waitFor(() => expect(onSubmit).toHaveBeenCalledWith({ rating: 3 }, expect.anything()));

    fireEvent.click(thirdStar);
    expect(thirdStar.getAttribute('aria-pressed')).toBe('false');
  });

  it('previews stars on hover and replaces the hint with validation feedback', async () => {
    render(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: { rating: 0 } }}>
        <RateField<Values>
          name="rating"
          hint="امتیاز خود را انتخاب کنید."
          rules={{ validate: (value) => value > 0 || 'ثبت امتیاز الزامی است.' }}
        />
        <button type="submit">ارسال</button>
      </Form>,
    );

    const fourthStar = screen.getByRole('button', { name: '4 ستاره' });
    fireEvent.mouseEnter(fourthStar);
    expect(screen.getAllByRole('button', { pressed: false }).slice(0, 4)).toHaveLength(4);
    expect(fourthStar.getAttribute('data-preview')).toBe('true');
    expect(fourthStar.querySelector('svg')?.className.baseVal).toContain('tw:fill-warning/40');

    fireEvent.mouseLeave(screen.getByRole('group', { name: 'امتیاز' }));
    expect(fourthStar.getAttribute('data-preview')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'ارسال' }));
    expect((await screen.findByRole('alert')).textContent).toContain('ثبت امتیاز الزامی است.');
  });

  it('scales star hit targets and icons with the shared size API', () => {
    expect(rateFieldVariants({ size: 'xs' }).star()).toContain('tw:size-8');
    expect(rateFieldVariants({ size: 'xl' }).star()).toContain('tw:size-12');
    expect(rateFieldVariants({ size: 'xl' }).icon()).toContain('tw:size-7');
  });
});
