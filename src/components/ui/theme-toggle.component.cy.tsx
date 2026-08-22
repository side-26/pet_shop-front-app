import { ThemeToggle } from '@/components/ui/theme-toggle';
import { THEME_STORAGE_KEY } from '@/components/ui/theme.helpers';

describe('ThemeToggle', () => {
  beforeEach(() => {
    cy.window().then((window) => window.localStorage.removeItem(THEME_STORAGE_KEY));
    cy.document().then((document) => {
      document.documentElement.classList.remove('dark');
      delete document.documentElement.dataset.theme;
    });
  });

  it('persists and applies dark and light modes to the document', () => {
    cy.mount(<ThemeToggle />);

    cy.contains('button', 'تیره').click().should('have.attr', 'aria-pressed', 'true');
    cy.document().its('documentElement').should('have.class', 'dark');
    cy.window().its('localStorage').invoke('getItem', THEME_STORAGE_KEY).should('equal', 'dark');

    cy.contains('button', 'روشن').click().should('have.attr', 'aria-pressed', 'true');
    cy.document().its('documentElement').should('not.have.class', 'dark');
    cy.document().its('documentElement.dataset.theme').should('equal', 'light');
  });

  it('offers a compact accessible control for navigation surfaces', () => {
    cy.window().then((window) => window.localStorage.setItem(THEME_STORAGE_KEY, 'light'));
    cy.mount(<ThemeToggle variant="icon" />);

    cy.get('button[aria-label="فعال‌سازی حالت تیره"]').click();
    cy.document().its('documentElement').should('have.class', 'dark');
    cy.get('button[aria-label="فعال‌سازی حالت روشن"]').click();
    cy.document().its('documentElement').should('not.have.class', 'dark');
  });
});
