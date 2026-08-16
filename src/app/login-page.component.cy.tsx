import { DirectionProvider } from '@base-ui/react/direction-provider';

import { LoginMobileView } from './(auth)/login/_components/login-view';
import { AuthLayoutShell } from '@/components/layouts/auth/auth-layout-shell';
import { routePaths } from '@/configs/route.path';

function mountLogin() {
  cy.mount(
    <DirectionProvider direction="rtl">
      <div dir="rtl">
        <AuthLayoutShell>
          <LoginMobileView />
        </AuthLayoutShell>
      </div>
    </DirectionProvider>,
  );
}

describe(`${routePaths.login} inside the auth layout`, () => {
  for (const height of [350, 568, 667]) {
    it(`keeps every action reachable at 375×${height}`, () => {
      cy.viewport(375, height);
      mountLogin();

      cy.get('main').should('be.visible');
      cy.get('input[name="phoneNumber"]')
        .scrollIntoView()
        .should('be.visible')
        .and('have.attr', 'dir', 'ltr');
      cy.get('input[name="password"]')
        .scrollIntoView()
        .should('be.visible')
        .and('have.attr', 'dir', 'ltr');
      cy.contains('a', 'فراموشی کلمه عبور؟').scrollIntoView().should('be.visible');
      cy.contains('button', 'ورود').scrollIntoView().should('be.visible');
      cy.contains('a', 'ثبت‌نام').scrollIntoView().should('be.visible');

      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
      });
    });
  }

  it('supports password visibility and remember-me interaction', () => {
    cy.viewport(375, 667);
    mountLogin();

    cy.get('input[name="password"]').type('petshop-pass');
    cy.get('button[aria-label="نمایش کلمه عبور"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    cy.contains('label', 'مرا به خاطر بسپار').click();
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'true');
  });

  it('remains usable in desktop dark mode', () => {
    cy.viewport(1280, 800);
    cy.document().then((document) => {
      document.documentElement.classList.add('dark');
    });
    mountLogin();

    cy.get('form[aria-label="فرم ورود"]').should('be.visible');
    cy.get('button[type="submit"]').should('be.visible');
    cy.get(`a[href="${routePaths.register}"]`).should('be.visible');
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
