import { AuthLayoutShell } from '@/components/layouts/auth/auth-layout-shell';

function mountLayout() {
  cy.mount(
    <div dir="rtl">
      <AuthLayoutShell>
        <div data-testid="auth-child" className="tw:min-h-48 tw:w-full tw:bg-card">
          محتوای احراز هویت
        </div>
      </AuthLayoutShell>
    </div>,
  );
}

describe('auth layout responsive composition', () => {
  it('stacks content and hides the dog on mobile', () => {
    cy.viewport(375, 667);
    mountLayout();

    cy.get('img[alt="توله‌سگ گلدن رتریور"]').should('not.be.visible');
    cy.get('section[aria-labelledby="auth-brand-title"]').then(($scene) => {
      cy.get('section[aria-label="محتوای احراز هویت"]').then(($panel) => {
        expect($panel[0].getBoundingClientRect().top).to.be.at.least(
          $scene[0].getBoundingClientRect().bottom,
        );
      });
    });
    cy.get('[data-testid="auth-child"]').scrollIntoView().should('be.visible');
    cy.get('section[aria-label="محتوای احراز هویت"]').then(($panel) => {
      const panel = $panel[0].getBoundingClientRect();

      expect(panel.left).to.equal(0);
      expect(panel.right).to.equal(375);
      expect(getComputedStyle($panel[0]).backgroundColor).to.equal('rgba(0, 0, 0, 0)');
    });
  });

  it('shows the dog from tablet widths', () => {
    cy.viewport(768, 900);
    mountLayout();

    cy.get('img[alt="توله‌سگ گلدن رتریور"]').should('be.visible');
  });

  it('uses a split composition on desktop', () => {
    cy.viewport(1440, 900);
    mountLayout();

    cy.get('section[aria-labelledby="auth-brand-title"]').then(($scene) => {
      cy.get('section[aria-label="محتوای احراز هویت"]').then(($panel) => {
        const scene = $scene[0].getBoundingClientRect();
        const panel = $panel[0].getBoundingClientRect();

        expect(scene.top).to.equal(panel.top);
        expect(scene.bottom).to.equal(panel.bottom);
        expect(
          Math.min(Math.abs(scene.right - panel.left), Math.abs(panel.right - scene.left)),
        ).to.be.lessThan(1);
      });
    });
    cy.get('img[alt="توله‌سگ گلدن رتریور"]').should('be.visible');
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
      expect(document.documentElement.scrollHeight).to.equal(document.documentElement.clientHeight);
    });
  });
});
