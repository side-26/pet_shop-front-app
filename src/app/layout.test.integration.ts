import { describe, expect, it, vi } from 'vitest';

vi.mock('next/font/local', () => ({
  default: () => ({ variable: '--font-default' }),
}));

import { appLogo } from '@/configs/app-logo';

import { metadata } from './layout';

describe('RootLayout metadata', () => {
  it('uses the shared application logo as the favicon', () => {
    expect(metadata.icons).toEqual({
      icon: {
        url: appLogo.src,
        type: appLogo.type,
      },
    });
  });
});
