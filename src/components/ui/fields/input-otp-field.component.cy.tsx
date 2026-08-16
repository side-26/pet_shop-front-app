import { InputOtpField } from '@/components/ui/fields/input-otp-field';
import { Form } from '@/components/ui/form';

type Values = { code: string };

describe('InputOtpField', () => {
  it('focuses on mount, completes with keyboard input, and submits through Form', () => {
    const onFinished = cy.spy().as('finished');
    const onSubmit = cy.spy().as('submitted');

    cy.mount(
      <Form<Values> options={{ defaultValues: { code: '' } }} handleSubmit={onSubmit}>
        <InputOtpField<Values>
          name="code"
          label="کد تأیید"
          hint="کد شش‌رقمی را وارد کنید."
          focusOnMount
          onFinished={onFinished}
          submitOnFinished
        />
      </Form>,
    );

    cy.get('[data-input-otp]').should('be.focused').type('123456');
    cy.get('[data-slot="input-otp-slot"]').should('have.length', 6);
    cy.get('[data-slot="input-otp-slot"]').then(($slots) => {
      expect([...$slots].map((slot) => slot.textContent).join('')).to.equal('123456');
    });
    cy.get('@finished').should('have.been.calledOnceWith', '123456');
    cy.get('@submitted').should('have.been.calledOnce');
  });

  it('exposes validation errors and scales slot geometry and text', () => {
    cy.mount(
      <Form<Values> options={{ defaultValues: { code: '' } }} handleSubmit={() => undefined}>
        <InputOtpField<Values>
          name="code"
          label="Verification code"
          hint="Enter the code"
          color="warning"
          size="xl"
          rules={{ required: 'Code is required' }}
        />
        <button type="submit">Verify</button>
      </Form>,
    );

    cy.get('[data-slot="input-otp-slot"]').first().should('have.css', 'width', '48px');
    cy.get('[data-slot="input-otp-slot"]').first().should('have.css', 'font-size', '16px');
    cy.contains('button', 'Verify').click();
    cy.get('[role="alert"]').should('have.text', 'Code is required');
    cy.get('[data-input-otp]').should('have.attr', 'aria-invalid', 'true');
  });
});
