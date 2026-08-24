import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ExpandableCard } from './expandable-card';

class ResizeObserverMock {
  observe = vi.fn();
  disconnect = vi.fn();
}

function renderExpandableCard(props: React.ComponentProps<typeof ExpandableCard.Root> = {}) {
  return render(
    <ExpandableCard.Root {...props}>
      <ExpandableCard.Content collapsedHeight={96}>
        <p>جزئیات غذای گربه</p>
      </ExpandableCard.Content>
      <ExpandableCard.Trigger collapsedLabel="نمایش بیشتر" expandedLabel="نمایش کمتر" />
    </ExpandableCard.Root>,
  );
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverMock);
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('ExpandableCard', () => {
  it('connects the collapsed trigger to its content and toggles its accessible state', () => {
    renderExpandableCard();

    const trigger = screen.getByRole('button', { name: 'نمایش بیشتر' });
    const content = screen.getByText('جزئیات غذای گربه').parentElement;

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-controls')).toBe(content?.parentElement?.id);
    expect(content?.parentElement?.style.height).toBe('96px');

    fireEvent.click(trigger);

    expect(screen.getByRole('button', { name: 'نمایش کمتر' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
  });

  it('supports an initially expanded state and custom trigger content', () => {
    render(
      <ExpandableCard.Root defaultExpanded data-testid="card">
        <ExpandableCard.Content collapsedHeight={80} showFade={false}>
          محتوای باز
        </ExpandableCard.Content>
        <ExpandableCard.Trigger>بستن جزئیات</ExpandableCard.Trigger>
      </ExpandableCard.Root>,
    );

    expect(screen.getByTestId('card').getAttribute('data-slot')).toBe('card');
    expect(screen.getByRole('button', { name: 'بستن جزئیات' }).getAttribute('aria-expanded')).toBe(
      'true',
    );
    expect(screen.queryByText('محتوای باز')?.nextElementSibling).toBeNull();
  });

  it('honors a consumer click handler that prevents the toggle', () => {
    render(
      <ExpandableCard.Root>
        <ExpandableCard.Content collapsedHeight={72}>جزئیات</ExpandableCard.Content>
        <ExpandableCard.Trigger onClick={(event) => event.preventDefault()}>
          باز کردن
        </ExpandableCard.Trigger>
      </ExpandableCard.Root>,
    );

    const trigger = screen.getByRole('button', { name: 'باز کردن' });
    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('rejects compound parts rendered outside the root', () => {
    expect(() => render(<ExpandableCard.Trigger>باز کردن</ExpandableCard.Trigger>)).toThrow(
      'ExpandableCard compound components must be used inside ExpandableCard.Root.',
    );
  });
});
