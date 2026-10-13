import { DirectionProvider } from '@base-ui/react/direction-provider';

import { ReactQueryProvider } from '@/app/react-query-provider';

import { HeaderProductSearch } from './header-product-search';

function mountSearch() {
  cy.mount(
    <DirectionProvider direction="rtl">
      <ReactQueryProvider>
        <HeaderProductSearch />
      </ReactQueryProvider>
    </DirectionProvider>,
  );
}

describe('HeaderProductSearch', () => {
  it('shows streamed product suggestions in the desktop HoverCard', () => {
    cy.viewport(1280, 720);
    cy.clock();
    mountSearch();

    cy.get('input[aria-label="جستجو در آیتم‌ها"]:visible').focus();
    cy.contains('برای دیدن پیشنهادها، نام آیتم را وارد کنید.').should('be.visible');
    cy.get('input[aria-label="جستجو در آیتم‌ها"]:visible').type('غذای سگ');
    cy.get('[role="status"]').should('contain.text', 'در حال جستجو');
    cy.tick(500);
    cy.contains('غذای خشک سگ بالغ').should('be.visible');
    cy.contains('مشاهده بیشتر').should('be.visible');
  });

  it('uses a modal overlay with the same streamed states on mobile and tablet', () => {
    cy.viewport(768, 1024);
    cy.clock();
    mountSearch();

    cy.get('input[aria-label="باز کردن جستجوی آیتم‌ها"]').click();
    cy.get('[role="dialog"]').should('be.visible');
    cy.contains('برای دیدن پیشنهادها، نام آیتم را وارد کنید.').should('be.visible');
    cy.get('input[aria-label="جستجو در آیتم‌ها"]:visible').type('خاک');
    cy.tick(500);
    cy.contains('خاک گربه کربن‌دار').should('be.visible');
    cy.clock().then((clock) => clock.restore());
    cy.get('button[aria-label="بازگشت از جستجو"]').click();
    cy.get('[role="dialog"]').should('not.exist');
  });
});
