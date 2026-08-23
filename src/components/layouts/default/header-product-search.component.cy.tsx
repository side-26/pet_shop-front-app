import { DirectionProvider } from '@base-ui/react/direction-provider';

import { HeaderProductSearch } from './header-product-search';

function mountSearch() {
  cy.mount(
    <DirectionProvider direction="rtl">
      <HeaderProductSearch />
    </DirectionProvider>,
  );
}

describe('HeaderProductSearch', () => {
  it('shows popular searches and debounced suggestions in HoverCard on desktop', () => {
    cy.viewport(1280, 720);
    cy.clock();
    mountSearch();

    cy.get('input[aria-label="جستجو در محصولات"]:visible').focus();
    cy.contains('h2', 'جستجوهای پرطرفدار').should('be.visible');
    cy.get('input[aria-label="جستجو در محصولات"]:visible').type('غذای سگ');
    cy.get('[role="status"]').should('contain.text', 'در حال جستجو');
    cy.tick(350);
    cy.contains('غذای خشک سگ بالغ').should('be.visible');
  });

  it('uses a modal overlay with the same search states on mobile and tablet', () => {
    cy.viewport(768, 1024);
    cy.clock();
    mountSearch();

    cy.get('input[aria-label="باز کردن جستجوی محصولات"]').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('h2', 'جستجوهای پرطرفدار').should('be.visible');
    cy.get('input[aria-label="جستجو در محصولات"]:visible').type('خاک');
    cy.tick(350);
    cy.contains('خاک گربه کربن‌دار').should('be.visible');
    cy.clock().then((clock) => clock.restore());
    cy.get('button[aria-label="بازگشت از جستجو"]').click();
    cy.get('[role="dialog"]').should('not.exist');
  });
});
