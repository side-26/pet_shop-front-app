import { Calendar } from '@/components/ui/calendar';

describe('Calendar', () => {
  it('selects today by default in uncontrolled single mode and remains interactive', () => {
    const today = new Date(2026, 8, 6);
    cy.mount(<Calendar mode="single" today={today} />);

    cy.get('[data-day="2026-09-06"]').should('have.attr', 'data-selected', 'true');
    cy.get('[data-day="2026-09-07"] button').click();
    cy.get('[data-day="2026-09-06"]').should('not.have.attr', 'data-selected');
    cy.get('[data-day="2026-09-07"]').should('have.attr', 'data-selected', 'true');
  });

  it('uses virtual comboboxes for Jalali month and year navigation', () => {
    const onSelect = cy.spy().as('select');
    cy.mount(<Calendar mode="single" defaultMonth={new Date(2026, 8, 1)} onSelect={onSelect} />);

    cy.get('select').should('not.exist');
    cy.get('[role="combobox"]').should('have.length', 2);
    cy.get('[role="combobox"]')
      .first()
      .invoke('val')
      .then((initialValue) => {
        cy.get('[role="combobox"]').first().click();
        cy.get('[role="option"]').not('[aria-selected="true"]').first().click();
        cy.get('[role="combobox"]').first().should('not.have.value', initialValue);
      });
    cy.get('[data-slot="virtual-combobox-list"]').should('not.exist');
    cy.get('[data-day]').first().click();
    cy.get('@select').should('have.been.called');
    cy.get('nav').should('not.exist');
  });

  it('disables both calendar comboboxes when navigation is disabled', () => {
    cy.mount(<Calendar defaultMonth={new Date(2026, 8, 1)} disableNavigation />);

    cy.get('[role="combobox"]').should('have.length', 2).and('be.disabled');
    cy.get('[data-slot="combobox-trigger"]').should('have.length', 2).and('be.disabled');
  });

  it('shows an accessible holiday badge on Fridays and additional holiday dates', () => {
    cy.mount(
      <Calendar
        mode="single"
        defaultMonth={new Date(2026, 8, 1)}
        modifiers={{ holiday: new Date(2026, 8, 8) }}
      />,
    );

    cy.get('[data-day][class*="tw:after:bg-error"]')
      .should('have.length.greaterThan', 4)
      .each(($day) => {
        cy.wrap($day).find('button').should('have.attr', 'aria-label').and('contain', 'تعطیل');
      });
  });
});
