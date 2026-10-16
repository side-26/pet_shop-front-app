import { DirectionProvider } from '@base-ui/react/direction-provider';

import { ReactQueryProvider } from '@/app/react-query-provider';

import { HeaderProductSearch } from './header-product-search';

const searchResults = {
  result: [
    {
      itemType: 'product',
      title: 'غذای خشک سگ بالغ',
      slug: 'adult-dog-food',
      mainImage: '/images/products/adult-dog-food.jpg',
      thumbnailImage: '/images/products/adult-dog-food-thumbnail.jpg',
    },
    {
      itemType: 'product',
      title: 'خاک گربه کربن‌دار',
      slug: 'carbon-cat-litter',
      mainImage: '/images/products/carbon-cat-litter.jpg',
      thumbnailImage: '/images/products/carbon-cat-litter-thumbnail.jpg',
    },
  ],
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 2,
    itemsPerPage: 3,
    hasNextPage: false,
    hasPrevPage: false,
    nextPage: null,
    prevPage: null,
  },
};

const emptySearchResults = {
  ...searchResults,
  result: [],
  pagination: { ...searchResults.pagination, totalItems: 0 },
};

function mountSearch(response: object = searchResults, statusCode = 200) {
  cy.intercept('GET', '/api/landing/search*', { statusCode, body: response }).as('landingSearch');
  cy.mount(
    <DirectionProvider direction="rtl">
      <ReactQueryProvider>
        <HeaderProductSearch className="header-product-search-test" />
      </ReactQueryProvider>
    </DirectionProvider>,
  );
}

function typeSearch(query: string, waitForRequest = true) {
  cy.get('input[aria-label="جستجو سریع"]:visible').type(query);
  cy.tick(500);
  if (waitForRequest) cy.wait('@landingSearch');
}

function restoreClock() {
  cy.clock().then((clock) => clock.restore());
}

describe('HeaderProductSearch', () => {
  it('renders desktop loading and result states, then clears the query', () => {
    cy.viewport(1280, 720);
    cy.clock();
    mountSearch();

    cy.get('.header-product-search-test').should('be.visible');
    cy.get('button[aria-label="باز کردن جستجوی سریع"]').should('not.exist');
    cy.get('input[aria-label="جستجو سریع"]:visible').focus();
    cy.contains('برای دیدن پیشنهادها، نام آیتم را وارد کنید.').should('be.visible');
    cy.get('input[aria-label="جستجو سریع"]:visible').type('غذای سگ');
    cy.get('[role="status"]').should('contain.text', 'در حال جستجو');
    cy.tick(500);
    cy.wait('@landingSearch');
    cy.contains('غذای خشک سگ بالغ').should('be.visible');
    cy.get('a').contains('مشاهده جزئیات').should('have.attr', 'href', '/products/adult-dog-food');
    cy.contains('مشاهده بیشتر').should('be.visible');
    cy.get('button[aria-label="پاک کردن جستجو"]').click();
    cy.get('input[aria-label="جستجو سریع"]:visible').should('have.value', '');
    cy.contains('برای دیدن پیشنهادها، نام آیتم را وارد کنید.').should('be.visible');

    restoreClock();
  });

  it('shows the empty fallback for desktop search results', () => {
    cy.viewport(1280, 720);
    cy.clock();
    mountSearch(emptySearchResults);

    cy.get('input[aria-label="جستجو سریع"]:visible').focus();
    typeSearch('ناموجود');
    cy.contains('آیتمی پیدا نشد').should('be.visible');
    cy.contains('برای «ناموجود» آیتمی پیدا نشد. عبارت دیگری را امتحان کنید.').should('be.visible');
    restoreClock();
  });

  it('shows the error fallback for failed desktop search results', () => {
    cy.viewport(1280, 720);
    cy.clock();
    mountSearch({ message: 'خطای سرور' }, 500);

    cy.get('input[aria-label="جستجو سریع"]:visible').focus();
    typeSearch('خطا');
    cy.contains('نمایش نتایج ممکن نیست').should('be.visible');
    cy.contains('لطفاً کمی بعد دوباره جستجو کنید.').should('be.visible');
    restoreClock();
  });

  it('opens the complete-results dialog from desktop suggestions and closes it with Escape', () => {
    cy.viewport(1280, 720);
    cy.clock();
    mountSearch();

    cy.get('input[aria-label="جستجو سریع"]:visible').focus();
    typeSearch('غذای سگ');
    cy.contains('مشاهده بیشتر').click();
    cy.get('[role="dialog"]').should('be.visible').and('contain.text', 'نتایج جستجو');
    cy.wait('@landingSearch');
    cy.get('[role="dialog"]').contains('غذای خشک سگ بالغ').should('be.visible');
    cy.get('[role="dialog"] input[aria-label="جستجو سریع"]').clear();
    cy.tick(500);
    cy.contains('برای دیدن نتایج، نام آیتم را وارد کنید.').should('be.visible');
    cy.get('body').type('{esc}');
    cy.tick(200);
    cy.get('[role="dialog"]').should('not.exist');
    restoreClock();
  });

  it('uses a lazy bottom navigation drawer with the same search, result, and close behavior on tablet', () => {
    cy.viewport(768, 1024);
    cy.clock();
    mountSearch();

    cy.get('input[aria-label="جستجو سریع"]').should('not.exist');
    cy.get('button[aria-label="باز کردن جستجوی سریع"]').click();
    cy.get('[data-slot="drawer-content"]').should('be.visible');
    cy.contains('برای دیدن نتایج، نام آیتم را وارد کنید.').should('be.visible');
    typeSearch('خاک');
    cy.get('[data-slot="drawer-content"]').contains('خاک گربه کربن‌دار').should('be.visible');
    cy.get('[data-slot="drawer-content"] button[aria-label="پاک کردن جستجو"]').click();
    cy.tick(500);
    cy.contains('برای دیدن نتایج، نام آیتم را وارد کنید.').should('be.visible');
    restoreClock();
    cy.get('button[aria-label="بستن جستجو"]').click();
    cy.get('[data-slot="drawer-content"]').should('not.exist');
  });

  it('navigates to a suggestion and closes the desktop search surface', () => {
    cy.viewport(1280, 720);
    cy.clock();
    mountSearch();

    cy.get('input[aria-label="جستجو سریع"]:visible').focus();
    typeSearch('غذای سگ');
    cy.contains('مشاهده جزئیات').first().click();
    cy.location('href').should('include', '/products/adult-dog-food');
    cy.get('[data-slot="hover-card-content"]').should('not.exist');
    restoreClock();
  });
});
