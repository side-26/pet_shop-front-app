import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Toaster, toast } from '@/components/ui/toast';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

describe('Dialog, Toast, and animated Collapsible', () => {
  it('opens a semantic Drawer with managed focus and closes via Escape or its action', () => {
    cy.mount(
      <Drawer>
        <DrawerTrigger render={<Button />}>Open drawer</DrawerTrigger>
        <DrawerContent color="success">
          <DrawerTitle>Delivery options</DrawerTitle>
          <DrawerDescription>Choose a delivery window.</DrawerDescription>
          <DrawerClose render={<Button />}>Close drawer</DrawerClose>
        </DrawerContent>
      </Drawer>,
    );

    cy.contains('button', 'Open drawer').as('drawerTrigger').click();
    cy.get('[role="dialog"]')
      .should('be.visible')
      .and('have.attr', 'data-color', 'success')
      .and('have.class', 'tw:bg-success-muted')
      .and('be.focused');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('@drawerTrigger').should('have.attr', 'aria-expanded', 'false').click();
    cy.contains('button', 'Close drawer').click();
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('@drawerTrigger').should('have.attr', 'aria-expanded', 'false');
  });

  it('opens a labeled modal Dialog and closes with Escape or its close action', () => {
    cy.mount(
      <Dialog>
        <DialogTrigger render={<Button />}>Open dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Pet profile</DialogTitle>
          <DialogDescription>Edit profile details.</DialogDescription>
          <DialogCancel>Cancel</DialogCancel>
          <DialogAction>Save</DialogAction>
        </DialogContent>
      </Dialog>,
    );
    cy.contains('button', 'Open dialog').as('trigger').click();
    cy.get('[role="dialog"]').should('be.visible').and('have.attr', 'aria-describedby');
    cy.get('body').type('{esc}');
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('@trigger').click();
    cy.contains('button', 'Save')
      .should('have.attr', 'data-variant', 'fill')
      .and('have.attr', 'data-color', 'primary')
      .click();
    cy.get('[role="dialog"]').should('not.exist');
    cy.get('@trigger').should('have.attr', 'aria-expanded', 'false');
  });

  it('announces and closes a semantic Toast', () => {
    cy.mount(
      <Toaster>
        <Button
          onClick={() =>
            toast.add({ type: 'error', title: 'Failed', description: 'Try again', timeout: 0 })
          }
        >
          Notify
        </Button>
      </Toaster>,
    );
    cy.contains('button', 'Notify').click();
    cy.contains('[data-slot="toast"]', 'Failed')
      .should('be.visible')
      .and('have.class', 'tw:text-error-muted-foreground');
    cy.get('[data-slot="toast-viewport"]')
      .should('have.css', 'top', '16px')
      .and('have.css', 'left', '250px');
    cy.get('[data-slot="toast-close"]')
      .should('have.css', 'color')
      .then((closeColor) => {
        cy.contains('[data-slot="toast"]', 'Failed')
          .should('have.css', 'color')
          .and('equal', closeColor);
      });
    cy.get('[data-slot="toast-close"]').click();
    cy.contains('[data-slot="toast"]', 'Failed').should('not.exist');
  });

  it('animates Collapsible height while preserving expanded state', () => {
    cy.mount(
      <Collapsible>
        <CollapsibleTrigger render={<Button />}>Details</CollapsibleTrigger>
        <CollapsibleContent>
          <p>Animated content</p>
        </CollapsibleContent>
      </Collapsible>,
    );
    cy.contains('button', 'Details')
      .as('trigger')
      .should('have.attr', 'aria-expanded', 'false')
      .click();
    cy.get('[data-slot="collapsible-content"]')
      .should('be.visible')
      .and(($panel) => expect($panel.height()).to.be.greaterThan(0));
    cy.get('@trigger').should('have.attr', 'aria-expanded', 'true').click();
    cy.get('[data-slot="collapsible-content"]').should(($panel) =>
      expect($panel.height()).to.equal(0),
    );
  });
});
