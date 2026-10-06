import { ThemeProvider } from '@/components/layouts/theme-provider';
import { ThemeToggle } from '@/components/ui/theme-toggle';

const themeStorageKey = 'theme';

function mountThemeToggle(variant?: 'dropdown' | 'icon') {
  cy.mount(
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ThemeToggle variant={variant} />
    </ThemeProvider>,
  );
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    cy.window().then((window) => window.localStorage.removeItem(themeStorageKey));
    cy.document().then((document) => {
      document.documentElement.classList.remove('dark');
      delete document.documentElement.dataset.theme;
    });
  });

  it('persists and applies dark and light modes from the appearance dropdown', () => {
    mountThemeToggle();

    cy.contains('button', 'حالت نمایش: سیستم').click();
    cy.get('[role="menuitemradio"][data-checked]').should('contain.text', 'سیستم');
    cy.get('[role="menuitemradio"]').contains('تیره').click();
    cy.document().its('documentElement').should('have.class', 'dark');
    cy.window().its('localStorage').invoke('getItem', themeStorageKey).should('equal', 'dark');

    cy.contains('button', 'حالت نمایش: تیره').click();
    cy.get('[role="menuitemradio"]').contains('روشن').click();
    cy.document().its('documentElement').should('not.have.class', 'dark');
    cy.window().its('localStorage').invoke('getItem', themeStorageKey).should('equal', 'light');
  });

  it('uses the system color scheme when system mode is selected', () => {
    mountThemeToggle();

    cy.contains('button', 'حالت نمایش: سیستم').click();
    cy.get('[role="menuitemradio"]').contains('تیره').click();
    cy.contains('button', 'حالت نمایش: تیره').click();
    cy.get('[role="menuitemradio"]').contains('سیستم').click();

    cy.window().its('localStorage').invoke('getItem', themeStorageKey).should('equal', 'system');
  });

  it('offers a compact appearance dropdown for navigation surfaces', () => {
    cy.window().then((window) => window.localStorage.setItem(themeStorageKey, 'light'));
    mountThemeToggle('icon');

    cy.get('button[aria-label="تغییر حالت نمایش: روشن"]').click();
    cy.get('[role="menuitemradio"]').contains('تیره').click();
    cy.document().its('documentElement').should('have.class', 'dark');
    cy.get('button[aria-label="تغییر حالت نمایش: تیره"]').click();
    cy.get('[role="menuitemradio"]').contains('سیستم').click();
    cy.window().its('localStorage').invoke('getItem', themeStorageKey).should('equal', 'system');
  });
});
