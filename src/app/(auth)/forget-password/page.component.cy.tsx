import { ForgetPasswordView } from './_components/forget-password-view';
import { AuthLayoutShell } from '@/components/layouts/auth/auth-layout-shell';
import { routePaths } from '@/configs/route.path';

function mountForgetPassword(resendSeconds = 60) {
  cy.mount(
    <AuthLayoutShell>
      <ForgetPasswordView resendSeconds={resendSeconds} />
    </AuthLayoutShell>,
  );
}

describe(`${routePaths.forgetPassword} inside the auth layout`, () => {
  it('keeps all three steps reachable on a short mobile viewport', () => {
    cy.viewport(375, 350);
    mountForgetPassword(1);

    cy.get('input[name="phoneNumber"]').type('09123456789');
    cy.contains('button', 'ارسال کد تأیید').click();

    cy.get('[data-step="2"]').should('be.visible');
    cy.contains('09123456789').should('be.visible');
    cy.get('[data-slot="input-otp-group"]')
      .should('have.attr', 'data-size', 'md')
      .find('[data-slot="input-otp-slot"]')
      .should('have.length', 6);
    cy.get('button[type="submit"]').should('not.exist');
    cy.contains('button', 'ارسال مجدد کد', { timeout: 2500 }).click();
    cy.get('[data-slot="countdown"]')
      .should('have.attr', 'data-state', 'active')
      .and('have.attr', 'aria-label', 'زمان باقی‌مانده: 00:01');

    cy.get('input[name="verificationCode"]').type('123456');
    cy.get('[data-step="3"]').should('be.visible');
    cy.get('input[name="newPassword"]').scrollIntoView().type('12345678');
    cy.get('input[name="confirmPassword"]').scrollIntoView().type('12345678');
    cy.contains('button', 'بازنشانی کلمه عبور').scrollIntoView().should('be.visible');

    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
    });
  });

  it('slides forward to the left and stays contained on desktop', () => {
    cy.viewport(1280, 800);
    mountForgetPassword();

    cy.get('input[name="phoneNumber"]').type('09123456789');
    cy.contains('button', 'ارسال کد تأیید').click();
    cy.get('[data-step="2"]').should('be.visible');
    cy.contains('مرحله 2 از ۳').should('be.visible');

    cy.get('[data-slot="card"]').should(($card) => {
      const cardRect = $card[0].getBoundingClientRect();
      const otpRect = $card[0]
        .querySelector('[data-slot="input-otp-group"]')!
        .getBoundingClientRect();

      expect(
        Math.abs(otpRect.left + otpRect.width / 2 - (cardRect.left + cardRect.width / 2)),
      ).to.be.lessThan(2);
    });
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
    });
  });
});
