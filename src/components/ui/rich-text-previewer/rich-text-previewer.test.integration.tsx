import { render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RichTextPreviewer, type RichTextPreviewerNodeProps } from '.';
import { richTextImageQuality } from './rich-text-previewer-image';

function CalloutNode({ children }: RichTextPreviewerNodeProps) {
  return <aside aria-label="یادداشت مهم">{children}</aside>;
}

describe('RichTextPreviewer', () => {
  it.each([
    ['mobile', '(max-width: 767px)', 65],
    ['tablet', '(min-width: 768px) and (max-width: 1023px)', 70],
    ['desktop', '', 85],
  ])('selects the expected image quality', (_viewport, matchingQuery, quality) => {
    const originalMatchMedia = window.matchMedia;
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        addEventListener: vi.fn(),
        matches: query === matchingQuery,
        removeEventListener: vi.fn(),
      })),
      writable: true,
    });

    try {
      expect(richTextImageQuality()).toBe(quality);
    } finally {
      Object.defineProperty(window, 'matchMedia', {
        configurable: true,
        value: originalMatchMedia,
        writable: true,
      });
    }
  });

  it('preserves semantic content, responsive typography, and accessible figures', () => {
    const { container } = render(
      <RichTextPreviewer>
        <RichTextPreviewer.Content
          fallbackImageAlt="راهنمای مراقبت خلاصه مقاله"
          content={{
            type: 'doc',
            content: [
              {
                type: 'heading',
                attrs: { level: 1 },
                content: [{ type: 'text', text: 'راهنمای مراقبت' }],
              },
              {
                type: 'paragraph',
                content: [{ type: 'text', text: 'متن توضیحی مقاله' }],
              },
              {
                type: 'image',
                attrs: {
                  caption: 'بازی روزانه برای سلامت سگ مهم است.',
                  height: 800,
                  src: '/rich-text-preview.webp',
                  width: 1200,
                },
              },
            ],
          }}
        />
      </RichTextPreviewer>,
    );

    const heading = screen.getByRole('heading', { level: 1, name: 'راهنمای مراقبت' });
    expect(container.querySelector('[data-slot="rich-text-previewer"]')?.getAttribute('dir')).toBe(
      'rtl',
    );
    expect(heading.className).toContain('lg:tw:text-heading-1');
    expect(heading.className).toContain('md:tw:text-heading-2');
    expect(heading.className).toContain('tw:text-heading-3');
    expect(screen.getByText('متن توضیحی مقاله').tagName).toBe('P');
    const image = screen.getByRole('img', { name: 'راهنمای مراقبت خلاصه مقاله' });
    expect(image.getAttribute('width')).toBe('1200');
    expect(image.getAttribute('height')).toBe('800');
    expect(image.getAttribute('loading')).toBe('lazy');
    expect(screen.getByText('بازی روزانه برای سلامت سگ مهم است.').tagName).toBe('FIGCAPTION');
    expect(container.querySelector('figure')).toBeTruthy();
  });

  it('resolves the natural dimensions of legacy image nodes before rendering next/image', async () => {
    const OriginalImage = window.Image;

    class NaturalDimensionImage {
      naturalHeight = 800;
      naturalWidth = 1200;
      onload: (() => void) | null = null;

      set src(_value: string) {
        this.onload?.();
      }
    }

    Object.defineProperty(window, 'Image', {
      configurable: true,
      value: NaturalDimensionImage,
      writable: true,
    });

    try {
      render(
        <RichTextPreviewer>
          <RichTextPreviewer.Content
            content={{
              type: 'doc',
              content: [{ type: 'image', attrs: { src: '/legacy-image.webp' } }],
            }}
          />
        </RichTextPreviewer>,
      );

      await waitFor(() => {
        expect(screen.getByRole('img', { name: 'تصویر مرتبط با متن' })).toBeTruthy();
      });
    } finally {
      Object.defineProperty(window, 'Image', {
        configurable: true,
        value: OriginalImage,
        writable: true,
      });
    }
  });

  it('renders a registered extension without changing the composer', () => {
    render(
      <RichTextPreviewer>
        <RichTextPreviewer.Content
          content={{
            type: 'doc',
            content: [
              {
                type: 'callout',
                content: [{ type: 'text', text: 'این نکته را به خاطر بسپارید.' }],
              },
            ],
          }}
          extensions={{ nodes: [{ type: 'callout', Component: CalloutNode }] }}
        />
      </RichTextPreviewer>,
    );

    expect(screen.getByRole('complementary', { name: 'یادداشت مهم' }).textContent).toContain(
      'این نکته را به خاطر بسپارید.',
    );
  });
});
