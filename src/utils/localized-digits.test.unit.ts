import { describe, expect, it } from 'vitest';

import { toEnglishDigits } from './localized-digits';

describe('toEnglishDigits', () => {
  it('converts Persian digits in otherwise unchanged text', () => {
    expect(toEnglishDigits('سفارش ۱۲۳، کد ۴۵۶')).toBe('سفارش 123، کد 456');
  });

  it('converts Arabic-Indic digits and preserves English digits', () => {
    expect(toEnglishDigits('٠١٢-789')).toBe('012-789');
  });
});
