import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

function AlertDialogFixture() {
  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outlined" />}>حذف آدرس</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>آدرس حذف شود؟</AlertDialogTitle>
          <AlertDialogDescription>این تغییر قابل بازگشت نیست.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>لغو</AlertDialogCancel>
          <AlertDialogAction color="error">حذف</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe('AlertDialog', () => {
  it('manages its portal, focus, Escape, and focus restoration in RTL', () => {
    cy.mount(<AlertDialogFixture />);

    cy.contains('button', 'حذف آدرس').as('trigger').click();
    cy.get('[role="alertdialog"]')
      .should('be.visible')
      .and('have.attr', 'aria-labelledby')
      .and('not.be.empty');
    cy.contains('button', 'لغو').should('be.focused');

    cy.get('body').type('{esc}');
    cy.get('[role="alertdialog"]').should('not.exist');
    cy.get('@trigger').should('be.focused').click();

    cy.contains('button', 'لغو').click();
    cy.get('[role="alertdialog"]').should('not.exist');
    cy.get('@trigger').should('be.focused');
  });
});
