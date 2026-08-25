import { DirectionProvider } from '@base-ui/react/direction-provider';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';

afterEach(cleanup);

describe('Tabs', () => {
  it('inherits color and size from its root and supports the native line list variant', () => {
    render(
      <Tabs defaultValue="details" color="success" size="lg">
        <TabsList aria-label="اطلاعات محصول" variant="line">
          <TabsTrigger value="details">جزئیات</TabsTrigger>
          <TabsTrigger value="reviews">دیدگاه‌ها</TabsTrigger>
        </TabsList>
        <TabsContent value="details">جزئیات محصول</TabsContent>
      </Tabs>,
    );
    const tabs = screen
      .getByRole('tablist', { name: 'اطلاعات محصول' })
      .closest('[data-slot="tabs"]');
    const trigger = screen.getByRole('tab', { name: 'جزئیات' });
    expect(tabs?.getAttribute('data-color')).toBe('success');
    expect(tabs?.getAttribute('data-size')).toBe('lg');
    expect(
      screen.getByRole('tablist', { name: 'اطلاعات محصول' }).getAttribute('data-variant'),
    ).toBe('line');
    expect(trigger.getAttribute('data-color')).toBe('success');
    expect(trigger.getAttribute('data-size')).toBe('lg');
    expect(trigger.className).toContain('tw:group-data-[variant=line]/tabs-list:after:bg-success');
  });

  it('supports selection, RTL keyboard navigation, and disabled tabs', async () => {
    const onValueChange = vi.fn();
    render(
      <DirectionProvider direction="rtl">
        <Tabs defaultValue="details" onValueChange={onValueChange}>
          <TabsList aria-label="بخش محصول">
            <TabsTrigger value="details">جزئیات</TabsTrigger>
            <TabsTrigger value="reviews">دیدگاه‌ها</TabsTrigger>
            <TabsTrigger value="questions" disabled>
              پرسش‌ها
            </TabsTrigger>
          </TabsList>
          <TabsContent value="details">محتوای جزئیات</TabsContent>
          <TabsContent value="reviews">محتوای دیدگاه‌ها</TabsContent>
        </Tabs>
      </DirectionProvider>,
    );
    const details = screen.getByRole('tab', { name: 'جزئیات' });
    const reviews = screen.getByRole('tab', { name: 'دیدگاه‌ها' });
    expect(details.getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tab', { name: 'پرسش‌ها' }).getAttribute('aria-disabled')).toBe('true');
    details.focus();
    fireEvent.keyDown(details, { key: 'ArrowRight' });
    await Promise.resolve();
    expect(document.activeElement).not.toBe(details);
    fireEvent.click(reviews);
    expect(onValueChange).toHaveBeenLastCalledWith('reviews', expect.anything());
    expect(reviews.getAttribute('aria-selected')).toBe('true');
  });
});
