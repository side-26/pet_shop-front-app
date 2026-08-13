import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function OpenTooltipFixture() {
  const [open, setOpen] = useState(true);

  return (
    <TooltipProvider delay={0}>
      <Tooltip open={open} onOpenChange={setOpen}>
        <TooltipTrigger render={<Button aria-label="Help" />}>Help</TooltipTrigger>
        <TooltipContent color="success" variant="outlined">
          More information
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function SolidTooltipFixture({ variant }: { variant: 'fill' | 'tonal' }) {
  return (
    <TooltipProvider delay={0}>
      <Tooltip open>
        <TooltipTrigger render={<Button aria-label={`${variant} help`} />}>Help</TooltipTrigger>
        <TooltipContent color="error" variant={variant}>
          More information
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('floating surfaces', () => {
  it('opens Popover in a portal and closes it with Escape', () => {
    cy.mount(
      <Popover>
        <PopoverTrigger render={<Button />}>Open</PopoverTrigger>
        <PopoverContent color="error" variant="fill">
          <PopoverTitle>Details</PopoverTitle>
          <PopoverDescription>Description</PopoverDescription>
        </PopoverContent>
      </Popover>,
    );
    cy.contains('button', 'Open').as('trigger').click();
    cy.get('[data-slot="popover-content"]')
      .should('be.visible')
      .and('have.attr', 'data-color', 'error');
    cy.get('body').type('{esc}');
    cy.get('[data-slot="popover-content"]').should('not.exist');
    cy.get('@trigger').should('have.attr', 'aria-expanded', 'false');
  });

  it('renders Tooltip in a portal and dismisses it with Escape', () => {
    cy.mount(<OpenTooltipFixture />);
    cy.get('[data-slot="tooltip-content"]')
      .should('be.visible')
      .and('have.attr', 'data-variant', 'outlined');
    cy.get('[data-slot="tooltip-arrow"]')
      .should('have.attr', 'data-side')
      .and('match', /^(top|bottom|left|right|inline-start|inline-end)$/);
    cy.get('[data-slot="tooltip-arrow"]')
      .should('match', 'svg')
      .find('path')
      .should('have.length', 2);
    cy.get('[data-slot="tooltip-arrow-mask"]').should('exist');
    cy.get('[data-slot="tooltip-arrow"] path[stroke="currentColor"]').should(
      'have.attr',
      'stroke-width',
      '1',
    );
    cy.get('body').type('{esc}');
    cy.get('[data-slot="tooltip-content"]').should('not.exist');
  });

  for (const variant of ['fill', 'tonal'] as const) {
    it(`joins the ${variant} Tooltip pointer without changing outlined geometry`, () => {
      cy.mount(<SolidTooltipFixture variant={variant} />);
      cy.get('[data-slot="tooltip-content"]').should('have.attr', 'data-variant', variant);
      cy.get('[data-slot="tooltip-solid-arrow-mask"]').should('not.exist');
      cy.get('[data-slot="tooltip-arrow-mask"]').should('not.exist');
      cy.get('[data-slot="tooltip-arrow"] path').should('have.length', 1);
      cy.get('[data-slot="tooltip-arrow"]').should(
        'have.css',
        'background-color',
        'rgba(0, 0, 0, 0)',
      );
    });
  }
});
