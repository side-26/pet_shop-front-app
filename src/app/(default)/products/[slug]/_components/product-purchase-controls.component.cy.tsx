import { ProductPurchaseControls } from './product-purchase-controls';

function PurchaseControlsFixture() {
  return (
    <>
      <ProductPurchaseControls
        mode="desktop"
        price={2975000}
        previousPrice={3500000}
        quantity={3}
      />
      <ProductPurchaseControls mode="mobile" price={2975000} previousPrice={3500000} quantity={3} />
    </>
  );
}

describe('ProductPurchaseControls', () => {
  it('uses the mobile purchase dock on tablet and enforces quantity bounds', () => {
    cy.viewport(768, 900);
    cy.mount(<PurchaseControlsFixture />);

    cy.get('[data-testid="mobile-purchase-controls"]').should('be.visible');
    cy.get('[data-testid="desktop-purchase-controls"]').should('not.be.visible');
    cy.get('button[aria-label="کاهش تعداد"]:visible').should('be.disabled');

    cy.get('button[aria-label="افزایش تعداد"]:visible').click();
    cy.get('[data-testid="mobile-purchase-controls"] output').should('have.text', '۲');
    cy.get('button[aria-label="افزایش تعداد"]:visible').should('be.disabled');
    cy.get('[data-testid="mobile-purchase-controls"]').then(($controls) => {
      cy.wrap($controls)
        .contains('button', 'افزودن به سبد خرید')
        .then(($button) => {
          const controlsRect = $controls[0].getBoundingClientRect();
          const buttonRect = $button[0].getBoundingClientRect();

          expect(buttonRect.left).to.be.at.least(controlsRect.left);
          expect(buttonRect.right).to.be.at.most(controlsRect.right);
        });
    });
  });

  it('replaces the add action with a fit-content counter on phones', () => {
    cy.viewport(390, 844);
    cy.mount(<PurchaseControlsFixture />);

    cy.get('[data-testid="mobile-purchase-controls"]')
      .contains('button', 'افزودن به سبد خرید')
      .click();
    cy.get('[data-testid="mobile-purchase-controls"] output').should('have.text', '۱');
    cy.get('[data-testid="mobile-purchase-controls"]')
      .contains('button', 'افزودن به سبد خرید')
      .should('not.be.visible');
    cy.get('[data-testid="mobile-purchase-controls"] [role="group"]').then(($counter) => {
      const counterRect = $counter[0].getBoundingClientRect();
      const controlsRect = $counter
        .closest('[data-testid="mobile-purchase-controls"]')![0]
        .getBoundingClientRect();

      expect(counterRect.width).to.be.lessThan(controlsRect.width);
    });
  });

  it('switches to the inline purchase panel on desktop', () => {
    cy.viewport(1280, 900);
    cy.mount(<PurchaseControlsFixture />);

    cy.get('[data-testid="desktop-purchase-controls"]').should('be.visible');
    cy.get('[data-testid="mobile-purchase-controls"]').should('not.be.visible');
    cy.contains('تنها ۳ عدد از این محصول باقی مانده است.').should('be.visible');
  });
});
