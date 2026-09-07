import { useState } from 'react';

import { FilterFormDialogContent } from '@/components/common/filter-form-dialog-content';
import { Dialog } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { RangedDatePicker } from '@/components/ui/ranged-date-picker';

type Values = { fromDate: string; toDate: string };

function DialogFixture() {
  const [open, setOpen] = useState(true);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <FilterFormDialogContent title="بازه زمانی داشبورد" onClose={() => setOpen(false)}>
        <Form<Values>
          handleSubmit={() => undefined}
          options={{
            defaultValues: {
              fromDate: '',
              toDate: '',
            },
          }}
        >
          <RangedDatePicker<Values>
            fromDateKey="fromDate"
            toDateKey="toDate"
            label="بازه زمانی"
            aria-label="بازه زمانی"
            hasTime
          />
        </Form>
      </FilterFormDialogContent>
    </Dialog>
  );
}

describe('RangedDatePicker', () => {
  it('opens on its first click without replacing its parent dialog', () => {
    cy.mount(<DialogFixture />);

    cy.get('[data-slot="dialog-content"]').then(($dialog) => {
      cy.get('button[aria-label="بازه زمانی"]').click();
      cy.get('[data-slot="ranged-date-picker-content"]').should('be.visible');
      cy.get('[role="group"][aria-label="زمان شروع"]').should('be.visible');
      cy.get('[role="group"][aria-label="زمان پایان"]').should('be.visible');
      cy.get('[data-slot="dialog-content"]').should(($currentDialog) => {
        expect($currentDialog[0]).to.equal($dialog[0]);
      });
    });
  });
});
