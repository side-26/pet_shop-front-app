import { lazy } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { animatedStaggeredListItemClassName } from '@/components/common/staggered-list';

import { LazyStaggeredList } from './lazy-staggered-list';

describe('LazyStaggeredList', () => {
  it('renders its resolved component inside the staggered section without skeleton markup', async () => {
    const DynamicItems = () => (
      <div>
        <article className={animatedStaggeredListItemClassName}>
          <div>کارت با بارگذاری پویا</div>
        </article>
      </div>
    );

    const DynamicPromiseComponent = lazy(async () => ({ default: DynamicItems }));

    render(
      <LazyStaggeredList
        aria-label="فهرست پویا"
        dynamicPromiseComponent={DynamicPromiseComponent}
      />,
    );

    expect(await screen.findByText('کارت با بارگذاری پویا')).toBeTruthy();
    expect(screen.getByRole('region', { name: 'فهرست پویا' })).toBeTruthy();
    expect(document.querySelector('.skeleton')).toBeNull();
  });
});
