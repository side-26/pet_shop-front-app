import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { AnimatedStaggeredList, animatedStaggeredListItemClassName } from './staggered-list';

describe('AnimatedStaggeredList', () => {
  it('wraps nested items marked with the static animation class', () => {
    const { container } = render(
      <AnimatedStaggeredList aria-label="نمونه فهرست متحرک">
        <div>
          <article className={animatedStaggeredListItemClassName}>
            <div>اول</div>
          </article>
          <article className={animatedStaggeredListItemClassName}>
            <div>دوم</div>
          </article>
        </div>
      </AnimatedStaggeredList>,
    );

    const section = screen.getByRole('region', { name: 'نمونه فهرست متحرک' });

    expect(section.tagName).toBe('SECTION');
    expect(container.querySelectorAll(`.${animatedStaggeredListItemClassName}`)).toHaveLength(2);
  });
});
