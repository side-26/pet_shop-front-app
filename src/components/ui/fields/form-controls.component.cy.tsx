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
import { SelectField } from '@/components/ui/fields/select-field';
import { Switch } from '@/components/ui/fields/switch';
import { TextareaField } from '@/components/ui/fields/textarea-field';
import { TextField } from '@/components/ui/fields/text-field';
import { Form } from '@/components/ui/form';

const items = [
  { label: 'Choose', value: null },
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
];
const options = items.filter(
  (item): item is { label: string; value: string } => item.value !== null,
);
const longOptions = Array.from({ length: 30 }, (_, index) => ({
  label: `Pet ${index + 1}`,
  value: `pet-${index + 1}`,
}));

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
              {options.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Form<Record<string, string>> handleSubmit={() => undefined}>
          <SelectField
            id="pet-type-field"
            name="petType"
            label="Pet type field"
            options={options}
          />
        </Form>
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
    cy.get('[data-slot="select-content"]:visible').contains('[role="option"]', 'Cat').click();
    cy.get('[role="combobox"][aria-label="Pet type"]').should('contain.text', 'Cat');
    cy.get('label[for="pet-type-field"]').should('have.text', 'Pet type field');
    cy.get('#pet-type-field[role="combobox"]').click();
    cy.get('[data-slot="select-content"]:visible').contains('[role="option"]', 'Dog').click();
    cy.get('#pet-type-field[role="combobox"]').should('contain.text', 'Dog');
    cy.contains('label', 'Terms').click();
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'true');
    cy.get('[role="switch"][aria-label="Notifications"]')
      .click()
      .should('have.attr', 'aria-checked', 'true');
    cy.get('[role="radio"][aria-label="Email"]')
      .click()
      .should('have.attr', 'aria-checked', 'true');
  });

  it('keeps a long option list in the viewport and scrollable', () => {
    cy.mount(
      <div dir="rtl">
        <Select items={longOptions}>
          <SelectTrigger aria-label="Long pet type list">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {longOptions.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>,
    );

    cy.get('[role="combobox"][aria-label="Long pet type list"]').click();
    cy.get('[data-slot="select-content"]:visible').should(($content) => {
      const content = $content[0];
      const list = content.querySelector('[role="listbox"]') as HTMLElement;
      const bounds = content.getBoundingClientRect();

      expect(bounds.top).to.be.greaterThanOrEqual(0);
      expect(bounds.bottom).to.be.lessThanOrEqual(Cypress.config('viewportHeight'));
      expect(list.scrollHeight).to.be.greaterThan(list.clientHeight);
    });
  });

  it('truncates a long selected value without reducing the select toggle', () => {
    const longLabel =
      'A very long pet type name that must remain available to assistive technology';
    const longValue = 'long-pet-type';

    cy.mount(
      <div dir="rtl" className="tw:w-48">
        <Select items={[{ label: longLabel, value: longValue }]} defaultValue={longValue}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value={longValue}>{longLabel}</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>,
    );

    cy.get('[data-slot="select-value"]')
      .should('contain.text', longLabel)
      .and('have.css', 'overflow', 'hidden')
      .then(($value) => expect($value[0].scrollWidth).to.be.greaterThan($value[0].clientWidth));
    cy.get('[data-slot="select-trigger-icon"]').should('have.css', 'flex-shrink', '0');
    cy.get('[role="combobox"]').click().should('have.attr', 'aria-expanded', 'true');
  });
});
