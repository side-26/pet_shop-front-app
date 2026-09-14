import { RateField } from '@/components/ui/fields/rate-field';
import { Form } from '@/components/ui/form';

type Values = { rating: number };

describe('RateField', () => {
  it('previews stars with pointer hover and toggles the selected rating through React Hook Form', () => {
    cy.mount(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: { rating: 0 } }}>
        <RateField<Values> name="rating" hint="امتیاز خود را انتخاب کنید." size="lg" />
      </Form>,
    );

    cy.get('[role="group"][aria-label="امتیاز"]').find('[data-rating]').eq(3).trigger('mouseover');
    cy.get('[data-preview="true"]').should('have.length', 4);
    cy.get('[data-preview="true"] svg').first().should('have.class', 'tw:fill-warning/40');

    cy.get('[data-rating="3"]').click();
    cy.get('[data-rating="1"]').should('have.attr', 'aria-pressed', 'true');
    cy.get('[data-rating="3"]').should('have.attr', 'aria-pressed', 'true');
    cy.get('[data-rating="4"]').should('have.attr', 'aria-pressed', 'false');

    cy.get('[data-rating="3"]').click().should('have.attr', 'aria-pressed', 'false');
  });

  it('supports keyboard rating changes with full-size focusable controls', () => {
    cy.mount(
      <Form<Values> handleSubmit={() => undefined} options={{ defaultValues: { rating: 0 } }}>
        <RateField<Values> name="rating" size="xl" />
      </Form>,
    );

    cy.get('[data-rating="3"]').focus().type('{rightarrow}');
    cy.get('[data-rating="4"]').should('be.focused').and('have.attr', 'aria-pressed', 'true');
    cy.get('[data-rating="4"]').should('have.css', 'width', '48px');
  });
});
