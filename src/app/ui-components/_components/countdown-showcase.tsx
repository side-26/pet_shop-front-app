'use client';

import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Countdown, type CountdownProps, type CountdownRef } from '@/components/ui/countdown';

import { ShowcaseSection } from './showcase-section';

const colors = [
  ['primary', 'اصلی'],
  ['secondary', 'ثانویه'],
  ['info', 'اطلاع‌رسانی'],
  ['success', 'موفق'],
  ['warning', 'هشدار'],
  ['error', 'خطا'],
] as const satisfies ReadonlyArray<readonly [NonNullable<CountdownProps['color']>, string]>;

const sizes = ['xs', 'sm', 'md', 'lg', 'xl'] as const satisfies ReadonlyArray<
  NonNullable<CountdownProps['size']>
>;

export function CountdownShowcase() {
  const countdownRef = useRef<CountdownRef>(null);

  return (
    <ShowcaseSection
      id="countdowns"
      title="Countdown"
      description="شمارش معکوس دیجیتال با نمایش شرطی ساعت، انیمیشن ورق‌خوردن ارقام، رنگ‌های معنایی و کنترل reset از طریق ref."
    >
      <div className="tw:flex tw:flex-col tw:items-start tw:gap-4">
        <Countdown ref={countdownRef} seconds={3721} color="info" size="xl" />
        <Button variant="outlined" color="info" onClick={() => countdownRef.current?.reset()}>
          شروع دوباره شمارش
        </Button>
      </div>

      <div className="tw:flex tw:flex-col tw:gap-4">
        <h3 className="tw:text-title-s">رنگ‌ها</h3>
        <div className="tw:flex tw:flex-wrap tw:items-center tw:gap-4">
          {colors.map(([color, label]) => (
            <div key={color} className="tw:flex tw:flex-col tw:gap-2">
              <p className="tw:text-label-s tw:text-muted-foreground">{label}</p>
              <Countdown seconds={125} color={color} />
            </div>
          ))}
        </div>
      </div>

      <div className="tw:flex tw:flex-col tw:gap-4">
        <h3 className="tw:text-title-s">اندازه‌ها</h3>
        <div className="tw:flex tw:flex-wrap tw:items-end tw:gap-4">
          {sizes.map((size) => (
            <div key={size} className="tw:flex tw:flex-col tw:gap-2">
              <p className="tw:text-label-s tw:text-muted-foreground">{size}</p>
              <Countdown seconds={32} size={size} color="success" />
            </div>
          ))}
        </div>
      </div>
    </ShowcaseSection>
  );
}
