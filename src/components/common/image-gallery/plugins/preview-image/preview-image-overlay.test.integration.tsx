import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PreviewImageOverlay, type PreviewImageOverlayPosition } from './preview-image-overlay';

const positionClasses: Record<PreviewImageOverlayPosition, string> = {
  'top-left': 'tw:start-3 tw:top-3',
  'top-right': 'tw:end-3 tw:top-3',
  'bottom-left': 'tw:bottom-3 tw:start-3',
  'bottom-right': 'tw:bottom-3 tw:end-3',
  center: 'tw:start-1/2 tw:top-1/2 tw:-translate-x-1/2 tw:-translate-y-1/2',
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
      expect(overlay.className).toContain('tw:p-3');
      expectedClasses.split(' ').forEach((className) => {
        expect(overlay.className).toContain(className);
      });
    },
  );
});
