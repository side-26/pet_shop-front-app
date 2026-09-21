import { useQueryClient } from '@tanstack/react-query';
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ReactQueryProvider } from './react-query-provider';

afterEach(cleanup);

function QueryClientConsumer() {
  const queryClient = useQueryClient();

  return <output>{queryClient instanceof Object ? 'configured' : 'missing'}</output>;
}

describe('ReactQueryProvider', () => {
  it('provides one QueryClient to its descendants', () => {
    render(
      <ReactQueryProvider>
        <QueryClientConsumer />
      </ReactQueryProvider>,
    );

    expect(screen.getByText('configured')).toBeTruthy();
  });
});
