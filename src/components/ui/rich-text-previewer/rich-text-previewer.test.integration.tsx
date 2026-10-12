import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RichTextPreviewer, type RichTextPreviewerNodeProps } from '.';

function CalloutNode({ children }: RichTextPreviewerNodeProps) {
  return <aside aria-label="یادداشت مهم">{children}</aside>;
}

describe('RichTextPreviewer', () => {
  it('preserves semantic content, responsive typography, and accessible figures', () => {
    const { container } = render(
      <RichTextPreviewer>
        <RichTextPreviewer.Content
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
                  alt: 'سگ در حال بازی در پارک',
                  caption: 'بازی روزانه برای سلامت سگ مهم است.',
                  src: '/rich-text-preview.webp',
                },
              },
            ],
          }}
        />
      </RichTextPreviewer>,
    );

    const heading = screen.getByRole('heading', { level: 1, name: 'راهنمای مراقبت' });
    expect(heading.className).toContain('lg:tw:text-heading-1');
    expect(heading.className).toContain('md:tw:text-heading-2');
    expect(heading.className).toContain('tw:text-heading-3');
    expect(screen.getByText('متن توضیحی مقاله').tagName).toBe('P');
    expect(screen.getByRole('img', { name: 'سگ در حال بازی در پارک' })).toBeTruthy();
    expect(screen.getByText('بازی روزانه برای سلامت سگ مهم است.').tagName).toBe('FIGCAPTION');
    expect(container.querySelector('figure')).toBeTruthy();
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
