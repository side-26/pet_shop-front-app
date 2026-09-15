import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { DataGrid } from './data-grid';

afterEach(cleanup);

describe('DataGrid', () => {
  it('renders a semantic label-value definition list with the screenshot-style defaults', () => {
    const { container } = render(
      <DataGrid.Root aria-label="مشخصات کولر">
        <DataGrid.Item>
          <DataGrid.Label>نوع کولر آبی</DataGrid.Label>
          <DataGrid.Value>سلولزی قابل حمل</DataGrid.Value>
        </DataGrid.Item>
      </DataGrid.Root>,
    );

    const grid = container.querySelector('dl[data-slot="data-grid"]');
    expect(grid).toBeTruthy();
    expect(grid?.tagName).toBe('DL');
    expect(grid?.getAttribute('data-border-color')).toBe('neutral');
    expect(grid?.getAttribute('data-variant')).toBe('line');
    expect(grid?.getAttribute('data-size')).toBe('md');
    expect(screen.getByRole('term').tagName).toBe('DT');
    expect(screen.getByRole('definition').tagName).toBe('DD');
  });

  it('exposes border-color, variant, and size axes without changing its compound structure', () => {
    render(
      <DataGrid.Root borderColor="primary" variant="outlined" size="lg" data-testid="grid">
        <DataGrid.Item>
          <DataGrid.Label>ویژگی پوشال</DataGrid.Label>
          <DataGrid.Value>قابل شست‌وشو</DataGrid.Value>
        </DataGrid.Item>
      </DataGrid.Root>,
    );

    const grid = screen.getByTestId('grid');
    expect(grid.getAttribute('data-border-color')).toBe('primary');
    expect(grid.getAttribute('data-variant')).toBe('outlined');
    expect(grid.getAttribute('data-size')).toBe('lg');
    expect(grid.querySelector('[data-slot="data-grid-item"]')).toBeTruthy();
  });
});
