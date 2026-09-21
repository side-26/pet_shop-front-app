import { routePaths } from '../../../configs/route.path';

const registrationSuccessMessage = 'حساب کاربری شما با موفقیت ساخته شد لطفا وارد اپلیکیشن شوید';

function createUniquePhoneNumber() {
  return `09${Date.now().toString().slice(-9)}`;
}

function fillRegistrationForm(phoneNumber: string, password: string) {
  cy.get('input[name="phoneNumber"]').clear().type(phoneNumber);
  cy.get('input[name="password"]').clear().type(password);
}

describe('Register', () => {
  let registeredPhoneNumber: string | undefined;

  beforeEach(() => {
    registeredPhoneNumber = undefined;
    cy.clearCookies();
    cy.visit(routePaths.register);
  });

  afterEach(() => {
    if (registeredPhoneNumber) {
      cy.task('deleteE2ERegisteredUser', registeredPhoneNumber, { log: false });
    }
  });

  it('renders an accessible RTL registration page and navigates to login', () => {
    cy.get('html').should('have.attr', 'dir', 'rtl');
    cy.get('h1').should('have.text', 'ثبت‌نام در پت‌شاپ').and('be.visible');
    cy.get('form[aria-label="فرم ثبت‌نام"]').should('be.visible');
    cy.get('label').contains('شماره موبایل').should('be.visible');
    cy.get('label').contains('کلمه عبور').should('be.visible');
    cy.get('input[name="phoneNumber"]')
      .should('have.attr', 'dir', 'ltr')
      .and('have.attr', 'autocomplete', 'tel-national');
    cy.get('input[name="password"]')
      .should('have.attr', 'dir', 'ltr')
      .and('have.attr', 'autocomplete', 'new-password');

    cy.contains('a', 'ورود').click();
    cy.location('pathname').should('eq', routePaths.login);
  });

  it('shows client validation and keeps invalid registration data on the page', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('شماره موبایل الزامی است.').should('be.visible');
    cy.contains('کلمه عبور الزامی است.').should('be.visible');

    fillRegistrationForm('08123456789', 'short');
    cy.get('button[type="submit"]').click();

    cy.contains('شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.').should('be.visible');
    cy.contains('کلمه عبور باید حداقل ۸ نویسه باشد.').should('be.visible');
    cy.location('pathname').should('eq', routePaths.register);
  });

  it('reveals and hides the password without changing its value', () => {
    const password = 'Petshop!123';

    cy.get('input[name="password"]').type(password).should('have.attr', 'type', 'password');
    cy.get('button[aria-label="نمایش کلمه عبور"]').click();
    cy.get('input[name="password"]')
      .should('have.attr', 'type', 'text')
      .and('have.value', password);
    cy.get('button[aria-label="پنهان‌کردن کلمه عبور"]').click();
    cy.get('input[name="password"]')
      .should('have.attr', 'type', 'password')
      .and('have.value', password);
  });

  it('registers through the backend, prevents duplicate submission, and reports duplicates', () => {
    const phoneNumber = createUniquePhoneNumber();
    const password = 'Petshop!123';
    registeredPhoneNumber = phoneNumber;

    cy.intercept('POST', routePaths.register, (request) => {
      request.on('response', (response) => {
        response.setDelay(400);
      });
    }).as('registerAction');

    fillRegistrationForm(phoneNumber, password);
    cy.get('button[type="submit"]').click();
    cy.get('button[type="submit"]')
      .should('be.disabled')
      .and('have.attr', 'aria-busy', 'true')
      .and('contain.text', 'در حال ثبت‌نام');
    cy.wait('@registerAction');
    cy.get('[data-slot="toast"]').should('contain.text', registrationSuccessMessage);
    cy.location('pathname', { timeout: 6_000 }).should('eq', routePaths.login);

    cy.visit(routePaths.register);
    fillRegistrationForm(phoneNumber, password);
    cy.get('button[type="submit"]').click();
    cy.wait('@registerAction');
    cy.get('[data-slot="toast"]').should('contain.text', 'کاربری با این مشخصات وجود دارد');
    cy.location('pathname').should('eq', routePaths.register);
  });

  it('remains usable without horizontal overflow on a narrow viewport', () => {
    cy.viewport(375, 568);

    cy.get('input[name="phoneNumber"]').scrollIntoView().should('be.visible');
    cy.get('input[name="password"]').scrollIntoView().should('be.visible');
    cy.get('button[type="submit"]').scrollIntoView().should('be.visible');
    cy.contains('a', 'ورود').scrollIntoView().should('be.visible');
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
    });
  });
});
