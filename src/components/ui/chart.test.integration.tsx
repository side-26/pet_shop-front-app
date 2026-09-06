import { render } from '@testing-library/react';
import { BarChart } from 'recharts';
import { describe, expect, it } from 'vitest';

import { ChartContainer } from './chart';

describe('ChartContainer', () => {
  it('provides chart color variables for a Recharts composition', () => {
    const { container } = render(
      <ChartContainer config={{ orders: { label: 'سفارش‌ها', color: 'var(--primary)' } }}>
        <BarChart data={[]} />
      </ChartContainer>,
    );

    expect(container.firstElementChild?.getAttribute('data-slot')).toBe('chart');
    expect(container.firstElementChild?.className).toContain(
      'tw:[&_.recharts-cartesian-grid_line]:stroke-border/50',
    );
    expect(container.querySelector('style')?.textContent).toContain(
      '--color-orders: var(--primary)',
    );
  });
});
