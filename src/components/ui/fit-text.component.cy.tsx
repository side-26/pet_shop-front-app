import { useState } from 'react';

import { typography } from '@/configs/typography.constant';

import { FitText } from './fit-text';

function ResizableFitText() {
  const [isNarrow, setIsNarrow] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setIsNarrow(true)}>
        کاهش عرض
      </button>
      <div style={{ width: isNarrow ? '1px' : '720px' }}>
        <FitText as="h2" variant="heading" className="custom-fit-text" data-testid="pet-name">
          فروشگاه پت‌شاپ
        </FitText>
      </div>
    </>
  );
}

describe('FitText', () => {
  it('uses the largest fitting level, then falls back and truncates when its container is too narrow', () => {
    cy.mount(<ResizableFitText />);

    cy.get('[data-testid="pet-name"]')
      .should('have.prop', 'tagName', 'H2')
      .and('have.class', typography['heading-1'])
      .and('have.class', 'custom-fit-text')
      .and('have.class', 'tw:whitespace-nowrap')
      .and('not.have.class', 'tw:truncate');

    cy.contains('button', 'کاهش عرض').click();

    cy.get('[data-testid="pet-name"]')
      .should('have.class', typography.caption)
      .and('have.class', 'tw:truncate');
  });

  it('truncates at the smallest level when no typography level fits and preserves element props', () => {
    cy.mount(
      <div style={{ width: '1px' }}>
        <FitText
          as="a"
          variant="label"
          href="/products/royal-canin"
          aria-label="غذای خشک سگ رویال کنین"
          style={{ display: 'block' }}
        >
          غذای خشک سگ رویال کنین
        </FitText>
      </div>,
    );

    cy.get('a')
      .should('have.attr', 'href', '/products/royal-canin')
      .and('have.attr', 'aria-label', 'غذای خشک سگ رویال کنین')
      .and('have.class', typography.caption)
      .and('have.class', 'tw:truncate');
  });
});
