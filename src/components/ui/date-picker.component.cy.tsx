import { DatePicker } from '@/components/ui/date-picker';
import { Form } from '@/components/ui/form';

const defaultValue = '2026-09-07T05:34:56.000Z';
type Values = { scheduledAt: string };

function DatePickerFixture({ disabled = false }: { disabled?: boolean }) {
  return (
    <Form<Values>
      handleSubmit={() => undefined}
      options={{ defaultValues: { scheduledAt: defaultValue } }}
    >
      <DatePicker<Values>
        name="scheduledAt"
        label="تاریخ و زمان"
        disabled={disabled}
        aria-label="تاریخ و زمان"
      />
    </Form>
  );
}

describe('DatePicker', () => {
  it('opens from the prefix icon, cancels drafts, and accepts today as ISO', () => {
    const now = new Date('2026-09-08T01:02:03.000Z');
    cy.clock(now.getTime());
    const onValueChange = cy.spy().as('valueChange');
    cy.mount(
      <Form<Values>
        handleSubmit={() => undefined}
        options={{ defaultValues: { scheduledAt: defaultValue } }}
      >
        <DatePicker<Values>
          name="scheduledAt"
          label="تاریخ و زمان"
          aria-label="تاریخ و زمان"
          onValueChange={onValueChange}
        />
      </Form>,
    );

    cy.tick(20);
    cy.get('button[aria-label="تاریخ و زمان"]')
      .invoke('text')
      .should('match', /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/);
    cy.get('button[aria-label="تاریخ و زمان"]').as('trigger').click();
    cy.get('[data-slot="date-picker-content"]').should('be.visible');
    cy.contains('button', 'امروز').click();
    cy.contains('button', 'لغو').click();
    cy.get('@valueChange').should('not.have.been.called');
    cy.get('input').should('not.exist');

    cy.get('@trigger').click();
    cy.contains('button', 'امروز').click();
    cy.contains('button', 'تأیید').click();
    cy.get('@valueChange').should('have.been.calledWith', now.toISOString());
    cy.get('[data-slot="date-picker-content"]').should('not.exist');
    cy.get('@trigger').should('have.focus');
  });

  it('closes with Escape without committing and disables all entry controls', () => {
    cy.mount(<DatePickerFixture disabled />);
    cy.get('button[aria-label="تاریخ و زمان"]').should('be.disabled');

    cy.mount(<DatePickerFixture />);
    cy.get('button[aria-label="تاریخ و زمان"]').as('trigger').click();
    cy.get('body').type('{esc}');
    cy.get('[data-slot="date-picker-content"]').should('not.exist');
    cy.get('@trigger').should('have.focus');
  });
});
