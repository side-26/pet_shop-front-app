import { Field } from '@/components/ui/field/default';
import { FieldLabel } from '@/components/ui/field/label';
import { Checkbox } from '@/components/ui/fields/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/fields/radio-group';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/fields/select';
import { Switch } from '@/components/ui/fields/switch';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';

const items = [
  { label: 'Choose', value: null },
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
];

describe('Form controls', () => {
  it('uses the compact field typography scale and tighter message spacing', () => {
    cy.mount(
      <div dir="rtl" className="tw:w-xl">
        <Form<Record<string, string>> handleSubmit={() => undefined}>
          <TextField
            id="compact-input"
            name="compact-input"
            label="ورودی کوچک"
            hint="راهنمای کوچک"
            size="xs"
          />
          <TextField
            id="large-input"
            name="large-input"
            label="ورودی بزرگ"
            hint="راهنمای بزرگ"
            size="xl"
          />
          <TextareaField
            id="large-textarea"
            name="large-textarea"
            label="توضیحات بزرگ"
            hint="راهنمای توضیحات"
            size="xl"
          />
        </Form>
      </div>,
    );

    cy.get('input[data-size="xs"]').should('have.css', 'font-size', '12px');
    cy.get('input[data-size="xl"]').should('have.css', 'font-size', '16px');
    cy.get('textarea[data-size="xl"]').should('have.css', 'font-size', '16px');
    cy.contains('راهنمای بزرگ').should('have.css', 'font-size', '13px');
    cy.contains('راهنمای توضیحات').should('have.css', 'font-size', '13px');

    cy.get('#large-input').then(($input) => {
      const field = $input[0].closest('[data-slot="field"]');
      const label = field?.querySelector('label')?.getBoundingClientRect();
      const input = $input[0].getBoundingClientRect();
      const message = field?.querySelector('#large-input-description')?.getBoundingClientRect();

      expect(label).not.to.be.undefined;
      expect(message).not.to.be.undefined;
      expect(message!.top - input.bottom).to.be.lessThan(input.top - label!.bottom);
    });
  });

  it('operates selection controls with pointer input', () => {
    cy.mount(
      <div dir="rtl">
        <Select items={items}>
          <SelectTrigger aria-label="Pet type">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {items.slice(1).map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Field className="tw:flex-row">
          <Checkbox id="agreement" />
          <FieldLabel htmlFor="agreement">Terms</FieldLabel>
        </Field>
        <Switch aria-label="Notifications" />
        <RadioGroup defaultValue="phone" aria-label="Contact method">
          <RadioGroupItem value="phone" aria-label="Phone" />
          <RadioGroupItem value="email" aria-label="Email" />
        </RadioGroup>
      </div>,
    );

    cy.get('[role="combobox"][aria-label="Pet type"]').click();
    cy.contains('[role="option"]', 'Cat').click();
    cy.get('[role="combobox"][aria-label="Pet type"]').should('contain.text', 'Cat');
    cy.contains('label', 'Terms').click();
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'true');
    cy.get('[role="switch"][aria-label="Notifications"]')
      .click()
      .should('have.attr', 'aria-checked', 'true');
    cy.get('[role="radio"][aria-label="Email"]')
      .click()
      .should('have.attr', 'aria-checked', 'true');
  });
});
