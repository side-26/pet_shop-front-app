import {
  VirtualSelect,
  VirtualSelectContent,
  VirtualSelectTrigger,
  VirtualSelectValue,
} from '@/components/ui/fields/virtual-select';

const options = Array.from({ length: 200 }, (_, index) => ({
  label: `گزینه ${index + 1}`,
  value: `option-${index + 1}`,
}));

describe('VirtualSelect', () => {
  it('renders only a virtualized window and selects an option after scrolling', () => {
    cy.mount(
      <VirtualSelect items={options}>
        <VirtualSelectTrigger aria-label="انتخاب گزینه">
          <VirtualSelectValue />
        </VirtualSelectTrigger>
        <VirtualSelectContent visibleItemCount={10} overscan={2} />
      </VirtualSelect>,
    );

    cy.get('[role="combobox"]').click();
    cy.get('[role="option"]').should('have.length.lessThan', 20);
    cy.get('[data-slot="virtual-select-list"]').scrollTo('bottom');
    cy.get('[role="option"]').contains('گزینه 200').click();
    cy.get('[role="combobox"]').should('contain.text', 'گزینه 200');
  });
});
