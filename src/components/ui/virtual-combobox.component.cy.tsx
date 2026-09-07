import {
  VirtualCombobox,
  VirtualComboboxContent,
  VirtualComboboxInput,
  VirtualComboboxTrigger,
} from '@/components/ui/virtual-combobox';

const options = Array.from({ length: 200 }, (_, index) => ({
  label: `گزینه ${index + 1}`,
  value: `option-${index + 1}`,
}));

describe('VirtualCombobox', () => {
  it('filters virtual rows and opens around the selected item', () => {
    cy.mount(
      <VirtualCombobox items={options} defaultValue="option-180">
        <div className="tw:relative">
          <VirtualComboboxInput aria-label="انتخاب گزینه" />
          <VirtualComboboxTrigger aria-label="باز کردن گزینه‌ها" />
        </div>
        <VirtualComboboxContent renderCount={8} overscan={2} />
      </VirtualCombobox>,
    );

    cy.get('[aria-label="باز کردن گزینه‌ها"]').click();
    cy.get('[data-slot="virtual-combobox-list"]').should(($list) => {
      expect($list[0].scrollTop).to.be.greaterThan(0);
    });
    cy.get('[aria-label="انتخاب گزینه"]').clear().type('گزینه 199');
    cy.get('[role="option"]')
      .should('have.length', 1)
      .and('contain.text', 'گزینه 199')
      .and('have.class', 'tw:hover:bg-accent')
      .and('have.class', 'tw:hover:text-accent-foreground');
  });
});
