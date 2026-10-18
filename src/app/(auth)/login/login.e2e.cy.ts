import { routePaths } from '../../../configs/route.path';

const loginSuccessMessage = 'با موفقیت وارد شد';
const invalidCredentialsMessage = 'کاربری با این مشخصات یافت نشد';
const password = 'Petshop!123';
const loginActionMatcher = { method: 'POST', pathname: routePaths.login } as const;

function createUniquePhoneNumber() {
  return `09${Date.now().toString().slice(-9)}`;
}

function fillLoginForm(phoneNumber: string, passwordValue: string) {
  cy.get('input[name="phoneNumber"]').clear().type(phoneNumber);
  cy.get('input[name="password"]').clear().type(passwordValue);
}

function visitLogin(path: string = routePaths.login) {
  cy.intercept('GET', '/api/auth/session').as('authSession');
  cy.visit(path);
  cy.wait('@authSession');
}

describe('Login', () => {
  const registeredPhoneNumber = createUniquePhoneNumber();

  before(() => {
    cy.clearCookies();
    cy.task('resetE2ERegisterRateLimit', undefined, { log: false });
    cy.intercept('GET', '/api/auth/session').as('registerAuthSession');
    cy.intercept('POST', routePaths.register).as('registerAction');
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
    visitLogin();
  });

  after(() => {
    cy.clearCookies();
    cy.task('deleteE2ERegisteredUser', registeredPhoneNumber, { log: false });
  });

  it('renders an accessible RTL login page and exposes recovery and registration routes', () => {
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('h1').should('have.text', 'ورود به پت‌شاپ').and('be.visible');
    cy.get('form[aria-label="فرم ورود"]').should('be.visible');
    cy.get('input[name="phoneNumber"]')
      .should('have.attr', 'dir', 'ltr')
      .and('have.attr', 'autocomplete', 'tel-national');
    cy.get('input[name="password"]')
      .should('have.attr', 'dir', 'ltr')
      .and('have.attr', 'autocomplete', 'current-password');
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'false');

    cy.contains('a', 'فراموشی کلمه عبور؟').should('have.attr', 'href', routePaths.forgetPassword);
    cy.contains('a', 'ثبت‌نام').should('have.attr', 'href', routePaths.register);
  });

  it('shows client validation and preserves invalid values', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('شماره موبایل الزامی است.').should('be.visible');
    cy.contains('کلمه عبور الزامی است.').should('be.visible');

    fillLoginForm('08123456789', 'short');
    cy.get('button[type="submit"]').click();

    cy.contains('شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.').should('be.visible');
    cy.contains('کلمه عبور باید حداقل ۶ نویسه باشد.').should('be.visible');
    cy.get('input[name="phoneNumber"]').should('have.value', '08123456789');
    cy.get('input[name="password"]').should('have.value', 'short');
    cy.location('pathname').should('eq', routePaths.login);
  });

  it('reveals and hides the password and toggles remember-me without changing form values', () => {
    fillLoginForm(registeredPhoneNumber, password);

    cy.get('button[aria-label="نمایش کلمه عبور"]').click();
    cy.get('input[name="password"]')
      .should('have.attr', 'type', 'text')
      .and('have.value', password);
    cy.get('button[aria-label="پنهان‌کردن کلمه عبور"]').click();
    cy.get('input[name="password"]')
      .should('have.attr', 'type', 'password')
      .and('have.value', password);
    cy.contains('label', 'مرا به خاطر بسپار').click();
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'true');
  });

  it('keeps the user on login and returns the same safe error for incorrect and unknown credentials', () => {
    cy.intercept(loginActionMatcher).as('loginAction');

    fillLoginForm(registeredPhoneNumber, 'Wrong-password!123');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginAction');
    cy.get('[data-slot="toast"]').should('contain.text', invalidCredentialsMessage);
    cy.location('pathname').should('eq', routePaths.login);

    fillLoginForm('09111111111', password);
    cy.get('button[type="submit"]').click();
    cy.wait('@loginAction');
    cy.get('[data-slot="toast"]').should('contain.text', invalidCredentialsMessage);
    cy.location('pathname').should('eq', routePaths.login);
  });

  it('prevents duplicate submission, persists the session, and respects a safe callback URL', () => {
    const callbackUrl = `${routePaths.productsList}?category=featured`;

    cy.clearCookies();
    visitLogin(`${routePaths.login}?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    cy.intercept(loginActionMatcher, (request) => {
      request.on('response', (response) => {
        response.setDelay(400);
      });
    }).as('loginAction');

    fillLoginForm(registeredPhoneNumber, password);
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should('be.disabled')
      .and('have.attr', 'aria-busy', 'true')
      .and('contain.text', 'در حال ورود');
    cy.wait('@loginAction');
    cy.wait('@authSession');
    cy.get('[data-slot="toast"]').should('contain.text', loginSuccessMessage);
    cy.location('pathname').should('eq', routePaths.productsList);
    cy.location('search').should('eq', '?category=featured');
    cy.request('/api/auth/session').its('body.userId').should('be.a', 'string').and('not.be.empty');

    cy.reload();
    cy.location('pathname').should('eq', routePaths.productsList);
  });

  it('rejects an external callback URL and falls back to the customer home page', () => {
    cy.clearCookies();
    visitLogin(`${routePaths.login}?callbackUrl=${encodeURIComponent('https://example.com')}`);
    cy.intercept(loginActionMatcher).as('loginAction');

    fillLoginForm(registeredPhoneNumber, password);
    cy.get('button[type="submit"]').click();
    cy.wait('@loginAction');
    cy.location('pathname').should('eq', routePaths.home);
  });

  it('remains usable without horizontal overflow on a narrow viewport', () => {
    cy.viewport(375, 568);

    cy.get('input[name="phoneNumber"]').scrollIntoView().should('be.visible');
    cy.get('input[name="password"]').scrollIntoView().should('be.visible');
    cy.contains('label', 'مرا به خاطر بسپار').scrollIntoView().should('be.visible');
    cy.contains('a', 'فراموشی کلمه عبور؟').scrollIntoView().should('be.visible');
    cy.get('button[type="submit"]').scrollIntoView().should('be.visible');
    cy.contains('a', 'ثبت‌نام').scrollIntoView().should('be.visible');
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
    });
  });
});
