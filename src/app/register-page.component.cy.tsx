import { DirectionProvider } from '@base-ui/react/direction-provider';

import { RegisterView } from './(auth)/register/_components/register-view';
import { AuthLayoutShell } from '@/components/layouts/auth/auth-layout-shell';
import { routePaths } from '@/configs/route.path';

function mountRegister() {
  cy.mount(
    <DirectionProvider direction="rtl">
      <div dir="rtl">
        <AuthLayoutShell>
          <RegisterView />
        </AuthLayoutShell>
      </div>
    </DirectionProvider>,
  );
}

describe(`${routePaths.register} inside the auth layout`, () => {
  for (const height of [350, 568, 667]) {
    it(`keeps every action reachable at 375×${height}`, () => {
      cy.viewport(375, height);
      mountRegister();

      cy.get('main').should('be.visible');
      cy.get('input[name="phoneNumber"]')
        .scrollIntoView()
        .should('be.visible')
        .and('have.attr', 'dir', 'ltr');
      cy.get('input[name="password"]')
        .scrollIntoView()
        .should('be.visible')
        .and('have.attr', 'dir', 'ltr');
      cy.contains('button', 'ثبت‌نام').scrollIntoView().should('be.visible');
      cy.get(`a[href="${routePaths.login}"]`).scrollIntoView().should('be.visible');
      cy.contains('فراموشی رمز عبور؟').should('not.exist');
      cy.contains('مرا به خاطر بسپار').should('not.exist');

      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
      });
    });
  }

  it('supports password visibility and remains usable in desktop dark mode', () => {
    cy.viewport(1280, 800);
    cy.document().then((document) => {
      document.documentElement.classList.add('dark');
    });
    mountRegister();

    cy.get('input[name="password"]').type('petshop-pass');
    cy.get('button[aria-label="نمایش رمز عبور"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    cy.get('form[aria-label="فرم ثبت‌نام"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.get('[data-slot="card"]').then(($card) => {
      const style = getComputedStyle($card[0]);

      expect(style.borderBottomLeftRadius).to.equal(style.borderTopLeftRadius);
      expect(style.borderBottomRightRadius).to.equal(style.borderTopRightRadius);
      expect(style.borderBottomLeftRadius).not.to.equal('0px');
    });
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
      expect(document.documentElement.scrollHeight).to.equal(document.documentElement.clientHeight);
    });
  });
});
