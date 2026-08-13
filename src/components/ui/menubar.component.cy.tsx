import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';

function MenubarFixture() {
  return (
    <Menubar aria-label="Application">
      <MenubarMenu>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Orders</MenubarLabel>
            <MenubarItem>New</MenubarItem>
            <MenubarItem>Print</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>Compact</MenubarItem>
          </MenubarGroup>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  );
}

describe('Menubar RTL', () => {
  it('opens without group-context errors and remains non-modal', () => {
    cy.mount(<MenubarFixture />);
    cy.contains('[data-slot="menubar-trigger"]', 'File').click();
    cy.get('[role="menu"]').should('be.visible');
    cy.contains('[data-slot="menubar-label"]', 'Orders').should('be.visible');
    cy.get('body').should('not.have.css', 'overflow', 'hidden');
    cy.get('body').type('{esc}');
    cy.get('[role="menu"]').should('not.exist');
  });

  it('moves between top-level triggers with RTL arrow keys', () => {
    cy.mount(<MenubarFixture />);
    cy.contains('[data-slot="menubar-trigger"]', 'File').focus().type('{leftarrow}');
    cy.contains('[data-slot="menubar-trigger"]', 'View').should('be.focused');
  });
});
