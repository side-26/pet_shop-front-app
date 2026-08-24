import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

describe('ToggleGroup', () => {
  it('supports RTL keyboard focus and single selection in a real browser', () => {
    cy.mount(
      <ToggleGroup aria-label="انتخاب وزن" defaultValue={['15kg']}>
        <ToggleGroupItem value="15kg">۱۵ کیلوگرم</ToggleGroupItem>
        <ToggleGroupItem value="4kg">۴ کیلوگرم</ToggleGroupItem>
      </ToggleGroup>,
    );

    cy.get('[data-slot="toggle-group"]').should('have.attr', 'data-variant', 'flat');
    cy.contains('button', '۱۵ کیلوگرم')
      .should('have.attr', 'data-variant', 'flat')
      .and('have.attr', 'aria-pressed', 'true')
      .focus();
    cy.focused().type('{leftarrow}');
    cy.contains('button', '۴ کیلوگرم').should('be.focused').click();
    cy.contains('button', '۴ کیلوگرم').should('have.attr', 'aria-pressed', 'true');
    cy.contains('button', '۱۵ کیلوگرم').should('have.attr', 'aria-pressed', 'false');
  });
});
