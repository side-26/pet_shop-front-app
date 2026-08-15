import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Form } from '@/components/ui/form';
import { CheckboxField } from './checkbox-field';
import { RadioGroupField } from './radio-group-field';
import { SwitchField } from './switch-field';

type Values = { accepted: boolean; alerts: boolean; contact: string };

afterEach(cleanup);

describe('selection fields', () => {
  it('syncs checkbox, switch, and radio values with the parent Form', async () => {
    const onSubmit = vi.fn();
    render(
      <Form<Values>
        handleSubmit={onSubmit}
        options={{ defaultValues: { accepted: false, alerts: false, contact: '' } }}
      >
        <CheckboxField<Values> name="accepted" label="Accept" hint="Checkbox hint" size="lg" />
        <SwitchField<Values> name="alerts" label="Alerts" hint="Switch hint" />
        <RadioGroupField<Values>
          name="contact"
          label="Contact"
          hint="Radio hint"
          options={[
            { value: 'email', label: 'Email' },
            { value: 'phone', label: 'Phone' },
          ]}
        />
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('checkbox', { name: 'Accept' }));
    fireEvent.click(screen.getByRole('switch', { name: 'Alerts' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Email' }));
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        { accepted: true, alerts: true, contact: 'email' },
        expect.anything(),
      ),
    );
  });

  it('shows validation messages from each field name in persistent descriptions', async () => {
    render(
      <Form<Values>
        handleSubmit={() => undefined}
        options={{ defaultValues: { accepted: false, alerts: false, contact: '' } }}
      >
        <CheckboxField<Values>
          name="accepted"
          label="Accept"
          hint="Hint"
          rules={{ required: 'Accept required' }}
        />
        <RadioGroupField<Values>
          name="contact"
          label="Contact"
          hint="Hint"
          rules={{ required: 'Contact required' }}
          options={[{ value: 'email', label: 'Email' }]}
        />
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    expect(await screen.findByText('Accept required')).toBeTruthy();
    expect(await screen.findByText('Contact required')).toBeTruthy();
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });
});
