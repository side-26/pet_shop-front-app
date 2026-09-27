import { ProductPurchaseControls } from './product-purchase-controls';
import { useCartStore } from '@/stores/cart.store';

const weights = [
  {
    id: 'weight-1',
    label: '۱ کیلوگرم',
    cartWeight: {
      _id: 'weight-1',
      metric: 'KG',
      value: 1,
      price: 2975000,
      discountPercentage: 15,
      quantity: 3,
    },
    price: 2975000,
    discountPercentage: 15,
    quantity: 3,
  },
] as const;

function PurchaseControlsFixture() {
  return (
    <>
      <ProductPurchaseControls
        productId="product-1"
        mode="desktop"
        price={2975000}
        previousPrice={3500000}
        quantity={3}
        weights={weights}
      />
      <ProductPurchaseControls
        productId="product-1"
        mode="mobile"
        price={2975000}
        previousPrice={3500000}
        quantity={3}
        weights={weights}
      />
    </>
  );
}

describe('ProductPurchaseControls', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
      serverCart: null,
      needsServerSync: false,
      pendingAddOperations: [],
      isSyncing: false,
      lastError: null,
    });
  });

  it('uses the mobile purchase dock on tablet and updates the matching weight cart entry', () => {
    cy.viewport(768, 900);
    cy.mount(<PurchaseControlsFixture />);

    cy.get('[data-testid="mobile-purchase-controls"]').should('be.visible');
    cy.get('[data-testid="desktop-purchase-controls"]').should('not.be.visible');
    cy.get('[data-testid="mobile-purchase-controls"]')
      .contains('button', 'افزودن به سبد خرید')
      .should('be.visible')
      .click();
    cy.get('[data-testid="mobile-purchase-controls"] [role="group"]').should('be.visible');
    cy.get('button[aria-label="افزایش تعداد"]:visible').click();
    cy.get('[data-testid="mobile-purchase-controls"] output').should('have.text', '۲');
    cy.then(() => expect(useCartStore.getState().items[0]?.quantity).to.equal(2));
  });

  it('replaces the add action with the selected weight counter on phones', () => {
    cy.viewport(390, 844);
    cy.mount(<PurchaseControlsFixture />);

    cy.get('[data-testid="mobile-purchase-controls"]')
      .contains('button', 'افزودن به سبد خرید')
      .should('be.visible')
      .click();
    cy.get('[data-testid="mobile-purchase-controls"] [role="group"]').should('be.visible');
    cy.get('[data-testid="mobile-purchase-controls"]')
      .contains('button', 'افزودن به سبد خرید')
      .should('not.exist');
  });

  it('switches to the inline purchase panel on desktop', () => {
    cy.viewport(1280, 900);
    cy.mount(<PurchaseControlsFixture />);

    cy.get('[data-testid="desktop-purchase-controls"]').should('be.visible');
    cy.get('[data-testid="mobile-purchase-controls"]').should('not.be.visible');
    cy.contains('تنها ۳ عدد از این محصول باقی مانده است.').should('be.visible');
  });
});
