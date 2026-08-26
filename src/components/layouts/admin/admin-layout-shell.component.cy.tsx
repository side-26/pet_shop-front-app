import { routePaths } from '@/configs/route.path';

import { AdminLayoutShellView } from './admin-layout-shell';

describe('AdminLayoutShell', () => {
  it('collapses the desktop navigation without hiding its destinations', () => {
    cy.viewport(1280, 800);
    cy.mount(
      <AdminLayoutShellView pathname={routePaths.admin}>
        <h1>داشبورد مدیریت</h1>
      </AdminLayoutShellView>,
    );

    cy.get('aside').should('be.visible').and('have.attr', 'data-collapsed', 'false');
    cy.get('button[aria-label="جمع کردن نوار مدیریت"]').click();
    cy.get('aside').should('have.attr', 'data-collapsed', 'true');
    cy.get('aside').find('a[aria-label="محصولات"]').should('be.visible');
    cy.get('button[aria-label="باز کردن نوار مدیریت"]').click();
    cy.get('aside').should('have.attr', 'data-collapsed', 'false');
  });

  it('opens the navigation Drawer on mobile and closes it with Escape', () => {
    cy.viewport(390, 844);
    cy.mount(
      <AdminLayoutShellView pathname={routePaths.admin}>محتوای مدیریت</AdminLayoutShellView>,
    );

    cy.get('aside').should('not.be.visible');
    cy.get('button[aria-label="باز کردن منوی مدیریت"]').should('be.visible').click();
    cy.get('[role="dialog"]').should('be.visible').and('contain.text', 'محصولات').and('be.focused');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
  });
});
