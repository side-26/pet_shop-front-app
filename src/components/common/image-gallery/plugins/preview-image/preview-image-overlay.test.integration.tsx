import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PreviewImageOverlay, type PreviewImageOverlayPosition } from './preview-image-overlay';

const positionClasses: Record<PreviewImageOverlayPosition, string> = {
  'top-left': 'tw:left-2 tw:top-2',
  'top-right': 'tw:right-2 tw:top-2',
  'bottom-left': 'tw:bottom-2 tw:left-2',
  'bottom-right': 'tw:bottom-2 tw:right-2',
  center: 'tw:left-1/2 tw:top-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2',
};

afterEach(cleanup);

describe('PreviewImageOverlay', () => {
  it.each(Object.entries(positionClasses) as [PreviewImageOverlayPosition, string][])(
    'positions preview content at %s',
    (position, expectedClasses) => {
      render(
        <div className="tw:relative">
          <PreviewImageOverlay position={position}>افزونه پیش‌نمایش</PreviewImageOverlay>
        </div>,
      );

      const overlay = screen.getByText('افزونه پیش‌نمایش');
      expect(overlay.dataset.position).toBe(position);
      expect(overlay.className).toContain('tw:absolute');
      expect(overlay.className).toContain('tw:p-2');
      expectedClasses.split(' ').forEach((className) => {
        expect(overlay.className).toContain(className);
      });
    },
  );
});
