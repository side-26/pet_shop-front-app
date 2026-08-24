describe('Product detail page', () => {
  it('renders the desktop composition without horizontal overflow', () => {
    cy.viewport(1280, 900);
    cy.visit('/products/adult-dog-food');

    cy.get('h1').should('have.text', 'غذای خشک سگ مدل رویال کنین Maxi Adult').and('be.visible');
    cy.get('[data-testid="desktop-purchase-controls"]').should('be.visible');
    cy.get('[data-testid="mobile-purchase-controls"]').should('not.be.visible');
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
    });
  });

  it('keeps the mobile purchase dock above navigation', () => {
    cy.viewport(390, 844);
    cy.visit('/products/adult-dog-food');

    cy.get('[data-testid="mobile-purchase-controls"]').should('be.visible');
    cy.get('nav[aria-label="ناوبری موبایل"]').should('be.visible');
    cy.get('[data-testid="mobile-purchase-controls"]').then(($dock) => {
      cy.get('nav[aria-label="ناوبری موبایل"]').then(($navigation) => {
        expect($dock[0].getBoundingClientRect().bottom).to.be.lessThan(
          $navigation[0].getBoundingClientRect().top + 1,
        );
      });
    });
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
    });
  });
});
