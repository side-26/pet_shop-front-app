import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

describe('Tabs', () => {
  it('supports RTL keyboard selection and disabled tabs', () => {
    cy.mount(
      <Tabs defaultValue="details" color="info" size="md">
        <TabsList aria-label="بخش محصول" variant="line">
          <TabsTrigger value="details">جزئیات</TabsTrigger>
          <TabsTrigger value="reviews">دیدگاه‌ها</TabsTrigger>
          <TabsTrigger value="questions" disabled>
            پرسش‌ها
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">محتوای جزئیات</TabsContent>
        <TabsContent value="reviews">محتوای دیدگاه‌ها</TabsContent>
      </Tabs>,
    );
    cy.get('[data-slot="tabs"]').should('have.attr', 'data-color', 'info');
    cy.get('[role="tablist"]').should('have.attr', 'data-variant', 'line');
    cy.contains('[role="tab"]', 'جزئیات').should('have.attr', 'aria-selected', 'true').focus();
    cy.focused().type('{rightarrow}');
    cy.focused().should('have.attr', 'role', 'tab');
    cy.contains('[role="tab"]', 'دیدگاه‌ها').click();
    cy.contains('[role="tab"]', 'دیدگاه‌ها').should('have.attr', 'aria-selected', 'true');
    cy.contains('[role="tab"]', 'پرسش‌ها').should('have.attr', 'aria-disabled', 'true');
  });
});
