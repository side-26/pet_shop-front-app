import { TimeSelector } from './time-selector';

describe('TimeSelector', () => {
  it('selects a time segment and restores focus after the wheel closes', () => {
    const onValueChange = cy.stub().as('onValueChange');
    cy.mount(<TimeSelector defaultValue="12:30:45" onValueChange={onValueChange} />);

    cy.get('button[aria-label="ساعت"]').as('hours').click();
    cy.get('[role="listbox"][aria-label="ساعت"]').type('{downArrow}{enter}');
    cy.get('@onValueChange').should('have.been.calledWith', '13:30:45');
    cy.get('@hours').should('have.focus');
  });

  it('closes a segment selector with Escape without changing the value', () => {
    const onValueChange = cy.stub().as('onValueChange');
    cy.mount(<TimeSelector defaultValue="12:30:45" onValueChange={onValueChange} />);

    cy.get('button[aria-label="ثانیه"]').click();
    cy.get('[role="listbox"][aria-label="ثانیه"]').type('{esc}');
    cy.get('[role="listbox"][aria-label="ثانیه"]').should('not.exist');
    cy.get('@onValueChange').should('not.have.been.called');
  });
});
