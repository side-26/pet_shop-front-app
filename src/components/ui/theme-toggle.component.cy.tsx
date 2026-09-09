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

  it('persists and applies dark and light modes from the appearance dropdown', () => {
    cy.mount(<ThemeToggle />);

    cy.contains('button', 'حالت نمایش: سیستم').click();
    cy.get('[role="menuitemradio"][data-checked]').should('contain.text', 'سیستم');
    cy.get('[role="menuitemradio"]').contains('تیره').click();
    cy.document().its('documentElement').should('have.class', 'dark');
    cy.window().its('localStorage').invoke('getItem', THEME_STORAGE_KEY).should('equal', 'dark');

    cy.contains('button', 'حالت نمایش: تیره').click();
    cy.get('[role="menuitemradio"]').contains('روشن').click();
    cy.document().its('documentElement').should('not.have.class', 'dark');
    cy.document().its('documentElement.dataset.theme').should('equal', 'light');
  });

  it('uses the system color scheme when system mode is selected', () => {
    cy.mount(<ThemeToggle />);

    cy.contains('button', 'حالت نمایش: سیستم').click();
    cy.get('[role="menuitemradio"]').contains('تیره').click();
    cy.contains('button', 'حالت نمایش: تیره').click();
    cy.get('[role="menuitemradio"]').contains('سیستم').click();

    cy.document().its('documentElement.dataset.theme').should('equal', 'system');
    cy.window().its('localStorage').invoke('getItem', THEME_STORAGE_KEY).should('equal', 'system');
  });

  it('offers a compact appearance dropdown for navigation surfaces', () => {
    cy.window().then((window) => window.localStorage.setItem(THEME_STORAGE_KEY, 'light'));
    cy.mount(<ThemeToggle variant="icon" />);

    cy.get('button[aria-label="تغییر حالت نمایش: روشن"]').click();
    cy.get('[role="menuitemradio"]').contains('تیره').click();
    cy.document().its('documentElement').should('have.class', 'dark');
    cy.get('button[aria-label="تغییر حالت نمایش: تیره"]').click();
    cy.get('[role="menuitemradio"]').contains('سیستم').click();
    cy.document().its('documentElement.dataset.theme').should('equal', 'system');
  });
});
