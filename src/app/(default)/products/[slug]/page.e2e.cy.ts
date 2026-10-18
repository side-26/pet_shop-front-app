type CatalogProduct = Readonly<{ slug: string; title: string }>;

function visitProduct(product: CatalogProduct) {
  cy.visit(`/products/${encodeURIComponent(product.slug)}`);
  cy.get('h1').should('have.text', product.title).and('be.visible');
}

describe('Product detail page', () => {
  let product: CatalogProduct | undefined;

  before(() => {
    cy.task<CatalogProduct>('createE2EProduct').then((fixture) => {
      product = fixture;
    });
  });

  after(() => {
    if (product) cy.task('deleteE2EProduct', product.slug);
  });

  it('renders the desktop composition without horizontal overflow', () => {
    expect(product, 'E2E product fixture').to.exist;
    cy.viewport(1280, 900);
    visitProduct(product!);

    cy.get('[data-testid="desktop-purchase-controls"]').should('be.visible');
    cy.get('[data-testid="mobile-purchase-controls"]').should('not.be.visible');
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
    });
  });

  it('keeps the mobile purchase dock above navigation', () => {
    expect(product, 'E2E product fixture').to.exist;
    cy.viewport(390, 844);
    visitProduct(product!);

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
