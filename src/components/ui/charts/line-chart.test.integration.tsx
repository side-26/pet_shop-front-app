import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LineChart, lineChartColors } from './line-chart';

describe('LineChart', () => {
  it('exposes the requested semantic line colors through the shared chart container', () => {
    const { container } = render(
      <LineChart
        ariaLabel="روند سفارش‌ها"
        data={[
          { month: 'فروردین', primary: 10, secondary: 20, white: 30, neutral: 40, success: 50 },
        ]}
        xAxisDataKey="month"
        series={Object.keys(lineChartColors).map((color) => ({
          color: color as keyof typeof lineChartColors,
          dataKey: color,
          label: color,
        }))}
      />,
    );

    expect(container.querySelector('[data-slot="chart"]')?.getAttribute('role')).toBe('img');
    expect(container.querySelector('style')?.textContent).toContain(
      '--color-primary: var(--primary)',
    );
    expect(container.querySelector('style')?.textContent).toContain(
      '--color-secondary: var(--secondary)',
    );
    expect(container.querySelector('style')?.textContent).toContain('--color-white: white');
    expect(container.querySelector('style')?.textContent).toContain(
      '--color-neutral: var(--muted-foreground)',
    );
    expect(container.querySelector('style')?.textContent).toContain(
      '--color-success: var(--success)',
    );
  });
});
