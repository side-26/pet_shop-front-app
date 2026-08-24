import { ExpandableCard } from './expandable-card';

function Example() {
  return (
    <ExpandableCard.Root variant="outlined" className="tw:max-w-md">
      <ExpandableCard.Content collapsedHeight={88}>
        <h2>غذای خشک گربه بالغ</h2>
        <p>
          فرمول کامل روزانه با پروتئین بالا برای گربه‌های بالغ. کد محصول <bdi>CAT-8420</bdi>.
        </p>
      </ExpandableCard.Content>
      <ExpandableCard.Trigger collapsedLabel="نمایش جزئیات" expandedLabel="بستن جزئیات" />
    </ExpandableCard.Root>
  );
}

describe('ExpandableCard', () => {
  it('supports keyboard focus, preserves focus while toggling, and exposes the controlled region', () => {
    cy.mount(<Example />);

    cy.contains('button', 'نمایش جزئیات')
      .as('trigger')
      .should('have.attr', 'aria-expanded', 'false')
      .then(($trigger) => {
        const contentId = $trigger.attr('aria-controls');
        expect(contentId).to.be.a('string').and.not.be.empty;
        cy.get(`#${CSS.escape(contentId!)}`).should('have.css', 'height', '88px');
      });

    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.get('@trigger').should('be.focused').click();
    cy.contains('button', 'بستن جزئیات')
      .should('be.focused')
      .and('have.attr', 'aria-expanded', 'true');

    cy.focused().click();
    cy.contains('button', 'نمایش جزئیات')
      .should('be.focused')
      .and('have.attr', 'aria-expanded', 'false');
  });
});
