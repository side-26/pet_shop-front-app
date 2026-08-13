import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

function MenuFixture() {
  return (
    <div data-testid="scroller" style={{ height: 120, overflow: 'auto' }}>
      <div style={{ height: 500 }}>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button />}>Actions</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

describe('DropdownMenu', () => {
  it('is non-modal and closes automatically when a nested container scrolls', () => {
    cy.mount(<MenuFixture />);
    cy.contains('button', 'Actions').click();
    cy.get('[role="menu"]').should('be.visible');
    cy.get('body').should('not.have.css', 'overflow', 'hidden');
    cy.get('[data-testid="scroller"]').scrollTo(0, 80);
    cy.get('[role="menu"]').should('not.exist');
    cy.contains('button', 'Actions').should('have.attr', 'aria-expanded', 'false');
  });

  it('supports keyboard navigation and Escape', () => {
    cy.mount(<MenuFixture />);
    cy.contains('button', 'Actions').click();
    cy.get('[role="menu"]').should('be.visible');
    cy.contains('[role="menuitem"]', 'Edit').focus();
    cy.get('body').type('{downarrow}');
    cy.contains('[role="menuitem"]', 'Delete').should('be.focused');
    cy.get('body').type('{esc}');
    cy.get('[role="menu"]').should('not.exist');
  });
});
