import { routePaths } from '../../../configs/route.path';

const password = 'Petshop!123';
const sessionCookieName = 'pet_shop_auth';
const cartStorageKey = 'pet_shop_cart';

function createUniquePhoneNumber() {
  return `09${Date.now().toString().slice(-9)}`;
}

function fillLoginForm(phoneNumber: string) {
  cy.get('input[name="phoneNumber"]').clear().type(phoneNumber);
  cy.get('input[name="password"]').clear().type(password);
}

function authenticate(phoneNumber: string) {
  cy.intercept('GET', '/api/auth/session').as('authSession');
  cy.intercept('GET', '/api/users/current').as('currentUser');
  cy.intercept({ method: 'POST', pathname: routePaths.login }).as('loginAction');
  cy.visit(routePaths.login);
  cy.wait('@authSession');

  fillLoginForm(phoneNumber);
  cy.get('button[type="submit"]').click();
  cy.wait('@loginAction');
  cy.wait('@authSession');
  cy.wait('@currentUser');
  cy.location('pathname').should('eq', routePaths.home);
  cy.getCookie(sessionCookieName).should('exist');
}

function openLogoutConfirmation() {
  cy.get('button[aria-label="حساب کاربری"]').should('be.visible').click();
  cy.get('[data-slot="dropdown-menu-content"]').should('be.visible');
  cy.contains('[role="menuitem"]', /^خروج$/)
    .should('be.visible')
    .click({ scrollBehavior: false });
  cy.get('[role="alertdialog"]').should('be.visible');
  cy.contains('از حساب خارج می‌شوید؟').should('be.visible');
  cy.contains('برای ادامه، لازم است دوباره وارد حساب کاربری خود شوید.').should('be.visible');
}

function seedPersistedCart() {
  cy.window().then((window) => {
    window.localStorage.setItem(
      cartStorageKey,
      JSON.stringify({
        state: {
          items: [{ type: 'pet', petId: 'logout-cart-item', quantity: 1 }],
          serverCart: null,
          needsServerSync: true,
          cartUserId: 'previous-user',
          guestCartUpdatedAt: '2026-01-01T00:00:00.000Z',
          itemTombstones: {},
          pendingAddOperations: [],
        },
        version: 0,
      }),
    );
  });
}

describe('Logout', () => {
  const registeredPhoneNumber = createUniquePhoneNumber();

  before(() => {
    cy.clearCookies();
    cy.task('resetE2ERegisterRateLimit', undefined, { log: false });
    cy.intercept('GET', '/api/auth/session').as('registerAuthSession');
    cy.intercept({ method: 'POST', pathname: routePaths.register }).as('registerAction');
    cy.visit(routePaths.register);
    cy.wait('@registerAuthSession');

    cy.get('input[name="phoneNumber"]').clear().type(registeredPhoneNumber);
    cy.get('input[name="password"]').clear().type(password);
    cy.get('button[type="submit"]').click();
    cy.wait('@registerAction');
    cy.location('pathname').should('eq', routePaths.login);
  });

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.viewport(1440, 900);
  });

  after(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.task('deleteE2ERegisteredUser', registeredPhoneNumber, { log: false });
  });

  it('requires confirmation and keeps the authenticated session when cancellation is chosen', () => {
    authenticate(registeredPhoneNumber);
    openLogoutConfirmation();

    cy.get('[role="alertdialog"]').contains('انصراف').click();
    cy.get('[role="alertdialog"]').should('not.exist');
    cy.getCookie(sessionCookieName).should('exist');
    cy.request('/api/auth/session').its('body.userId').should('be.a', 'string').and('not.be.empty');
    cy.get('button[aria-label="حساب کاربری"]').should('be.visible');
  });

  it('invalidates the backend session, preserves the persisted cart, and blocks protected routes', () => {
    authenticate(registeredPhoneNumber);
    openLogoutConfirmation();
    seedPersistedCart();

    cy.intercept({ method: 'POST', pathname: routePaths.home }).as('logoutAction');
    cy.intercept('GET', '/api/auth/session').as('logoutSession');
    cy.get('[role="alertdialog"]').contains('تأیید').click();
    cy.wait('@logoutAction');
    cy.wait('@logoutSession');
    cy.location('pathname').should('eq', routePaths.login);
    cy.getCookie(sessionCookieName).should('not.exist');
    cy.request('/api/auth/session').its('body.userId').should('eq', null);
    cy.get('[data-slot="toast"]').should('contain.text', 'با موفقیت از حساب کاربری خارج شدید.');
    cy.get('#login-title').should('have.text', 'ورود به پت‌شاپ').and('be.visible');
    cy.get('form[aria-label="فرم ورود"]').should('be.visible');

    cy.window().then((window) => {
      const persisted = JSON.parse(window.localStorage.getItem(cartStorageKey) ?? '{}');

      expect(persisted.state).to.deep.equal({
        items: [{ type: 'pet', petId: 'logout-cart-item', quantity: 1 }],
        serverCart: null,
        needsServerSync: true,
        cartUserId: 'previous-user',
        guestCartUpdatedAt: '2026-01-01T00:00:00.000Z',
        itemTombstones: {},
        pendingAddOperations: [],
      });
    });

    cy.visit(routePaths.profile);
    cy.location('pathname').should('eq', routePaths.login);
    cy.location('search').should('eq', `?callbackUrl=${encodeURIComponent(routePaths.profile)}`);
  });
});
