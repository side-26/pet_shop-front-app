import { DirectionProvider } from '@base-ui/react/direction-provider';

import { LoginMobileView } from './(auth)/login/_components/login-mobile-view';

function mountLogin() {
  cy.mount(
    <DirectionProvider direction="rtl">
      <div dir="rtl">
        <LoginMobileView />
      </div>
    </DirectionProvider>,
  );
}

function shouldBeFullyInsideViewport(selector: string) {
  cy.get(selector).then(($element) => {
    const bounds = $element[0].getBoundingClientRect();
    const viewport = $element[0].ownerDocument.defaultView;

    expect(viewport).not.to.equal(null);
    expect(bounds.top).to.be.at.least(0);
    expect(bounds.bottom).to.be.at.most(viewport?.innerHeight ?? 0);
    expect(bounds.left).to.be.at.least(0);
    expect(bounds.right).to.be.at.most(viewport?.innerWidth ?? 0);
  });
}

describe('/login mobile layout', () => {
  for (const height of [350, 568, 667]) {
    it(`keeps every action reachable at 375×${height}`, () => {
      cy.viewport(375, height);
      mountLogin();

      cy.get('main').should('be.visible');
      cy.get('input[name="phoneNumber"]').should('be.visible').and('have.attr', 'dir', 'ltr');
      cy.get('input[name="password"]').should('be.visible').and('have.attr', 'dir', 'ltr');
      cy.contains('a', 'فراموشی رمز عبور؟').should('be.visible');
      cy.contains('button', 'ورود').should('be.visible');
      cy.contains('a', 'ثبت‌نام').should('be.visible');

      shouldBeFullyInsideViewport('input[name="phoneNumber"]');
      shouldBeFullyInsideViewport('input[name="password"]');
      shouldBeFullyInsideViewport('button[type="submit"]');
      shouldBeFullyInsideViewport('a[href="/register"]');

      cy.document().then((document) => {
        expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
        expect(document.documentElement.scrollHeight).to.equal(
          document.documentElement.clientHeight,
        );
      });
    });
  }

  it('supports password visibility and remember-me interaction', () => {
    cy.viewport(375, 667);
    mountLogin();

    cy.get('input[name="password"]').type('petshop-pass');
    cy.get('button[aria-label="نمایش رمز عبور"]').click();
    cy.get('input[name="password"]').should('have.attr', 'type', 'text');
    cy.contains('label', 'مرا به خاطر بسپار').click();
    cy.get('[role="checkbox"]').should('have.attr', 'aria-checked', 'true');
  });

  it('remains usable in short landscape and dark mode', () => {
    cy.viewport(667, 375);
    cy.document().then((document) => {
      document.documentElement.classList.add('dark');
    });
    mountLogin();

    cy.get('form[aria-label="فرم ورود"]').should('be.visible');
    shouldBeFullyInsideViewport('button[type="submit"]');
    shouldBeFullyInsideViewport('a[href="/register"]');
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
      expect(document.documentElement.scrollHeight).to.equal(document.documentElement.clientHeight);
    });
  });
});
