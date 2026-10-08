import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { EmptyStateBoundary, EmptyStateBoundaryClient } from '.';

afterEach(cleanup);

describe('EmptyStateBoundary', () => {
  it.each([
    ['server', EmptyStateBoundary],
    ['client', EmptyStateBoundaryClient],
  ] as const)('renders the fallback for empty %s data', (_, Boundary) => {
    render(
      <Boundary data={[]} fallback={<p>موردی وجود ندارد</p>}>
        <p>فهرست موارد</p>
      </Boundary>,
    );

    expect(screen.getByText('موردی وجود ندارد')).toBeTruthy();
    expect(screen.queryByText('فهرست موارد')).toBeNull();
  });

  it.each([
    ['server', EmptyStateBoundary],
    ['client', EmptyStateBoundaryClient],
  ] as const)('renders children for populated %s data', (_, Boundary) => {
    render(
      <Boundary data={['article']} fallback={<p>موردی وجود ندارد</p>}>
        <p>فهرست موارد</p>
      </Boundary>,
    );

    expect(screen.getByText('فهرست موارد')).toBeTruthy();
    expect(screen.queryByText('موردی وجود ندارد')).toBeNull();
  });

  it.each([
    ['server', EmptyStateBoundary],
    ['client', EmptyStateBoundaryClient],
  ] as const)('uses the custom empty predicate for %s data', (_, Boundary) => {
    render(
      <Boundary
        data={['article']}
        fallback={<p>فهرست موردی برای نمایش ندارد</p>}
        isEmpty={() => true}
      >
        <p>فهرست موارد</p>
      </Boundary>,
    );

    expect(screen.getByText('فهرست موردی برای نمایش ندارد')).toBeTruthy();
    expect(screen.queryByText('فهرست موارد')).toBeNull();
  });
});
