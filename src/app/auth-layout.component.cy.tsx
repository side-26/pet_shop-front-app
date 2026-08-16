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

  it('keeps the tablet composition through 1024px', () => {
    cy.viewport(1024, 900);
    mountLayout();

    cy.get('img[alt="توله‌سگ گلدن رتریور"]').should('be.visible');
    cy.get('section[aria-labelledby="auth-brand-title"]').then(($scene) => {
      cy.get('section[aria-label="محتوای احراز هویت"]').then(($panel) => {
        expect($panel[0].getBoundingClientRect().top).to.be.at.least(
          $scene[0].getBoundingClientRect().bottom,
        );
      });
    });
  });

  it('creates the desktop scene in code and aligns the form to the right from 1025px', () => {
    cy.viewport(1025, 900);
    mountLayout();

    cy.get('main img').should('have.length', 1);
    cy.get('section[aria-labelledby="auth-brand-title"]').then(($scene) => {
      cy.get('[data-testid="auth-child"]').then(($child) => {
        const scene = $scene[0].getBoundingClientRect();
        const child = $child[0].getBoundingClientRect();

        expect(scene.top).to.equal(0);
        expect(scene.right).to.equal(1025);
        expect(scene.bottom).to.equal(900);
        expect(scene.right - child.right).to.equal(16);
      });
    });
    cy.get('img[alt="توله‌سگ گلدن رتریور"]').should('be.visible');
  });

  it('extends the desktop scene while pinning the form plane after 1536px', () => {
    cy.viewport(1800, 1000);
    mountLayout();

    cy.get('main').then(($layout) => {
      const layout = $layout[0].getBoundingClientRect();

      expect(layout.width).to.equal(1800);
      expect(layout.left).to.equal(0);
      expect(layout.right).to.equal(1800);
    });
    cy.get('section[aria-label="محتوای احراز هویت"]').then(($panel) => {
      const panel = $panel[0].getBoundingClientRect();

      expect(panel.right).to.equal(1536);
    });
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.equal(document.documentElement.clientWidth);
      expect(document.documentElement.scrollHeight).to.equal(document.documentElement.clientHeight);
    });
  });
});
