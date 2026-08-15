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

const items = [
  { label: 'Choose', value: null },
  { label: 'Dog', value: 'dog' },
  { label: 'Cat', value: 'cat' },
];

describe('Form controls', () => {
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
