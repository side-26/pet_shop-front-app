import { DirectionProvider } from '@base-ui/react/direction-provider';

import { routePaths } from '@/configs/route.path';

import { MobileHeaderMenu } from './mobile-header-menu';

describe('MobileHeaderMenu', () => {
  it('exposes services and about links in an accessible, dismissible menu', () => {
    cy.mount(
      <DirectionProvider direction="rtl">
        <MobileHeaderMenu />
      </DirectionProvider>,
    );

    cy.get('button[aria-label="باز کردن منوی بیشتر"]').click();
    cy.get('[role="menu"]').should('be.visible');
    cy.get('[role="menuitem"]')
      .contains('خدمات ما')
      .should('have.attr', 'href', routePaths.services);
    cy.get('[role="menuitem"]').contains('درباره ما').should('have.attr', 'href', routePaths.about);
    cy.get('button[aria-label="باز کردن منوی بیشتر"]').type('{esc}');
    cy.get('[role="menu"]').should('not.exist');
  });
});
