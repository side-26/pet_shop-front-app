import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PreviewImageOverlay, PreviewImagePreview } from './plugins/preview-image';
import { ImageGallery } from './image-gallery';

vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

const images = [
  {
    src: '/images/home/product-dog-food.jpg',
    alt: 'غذای خشک سگ',
    placeholderImage: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  },
  { src: '/images/home/product-cat-litter.jpg', alt: 'خاک گربه', fit: 'contain' as const },
] as const;

describe('ImageGallery', () => {
  it('loads the first preview eagerly, uses its placeholder, and switches desktop previews without changing layout', () => {
    render(<ImageGallery ariaLabel="تصاویر محصول" images={images} />);

    const firstPreview = screen.getAllByRole('img', { name: images[0].alt })[0];
    expect(firstPreview.getAttribute('loading')).toBe('eager');
    expect(firstPreview.getAttribute('style')).toContain('background-image');

    const secondImageButton = screen.getByRole('button', { name: 'نمایش تصویر 2' });
    expect(secondImageButton.getAttribute('aria-pressed')).toBe('false');
    expect(secondImageButton.className).toContain('tw:will-change-transform');

    fireEvent.click(secondImageButton);

    expect(secondImageButton.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getAllByRole('img', { name: images[1].alt })[0].getAttribute('loading')).toBe(
      'lazy',
    );
  });

  it('renders the preview composition in each preview image surface', () => {
    render(
      <ImageGallery
        images={images}
        previewImagePreview={
          <PreviewImagePreview>
            <PreviewImageOverlay position="top-right">برچسب تصویر</PreviewImageOverlay>
          </PreviewImagePreview>
        }
      />,
    );

    expect(screen.getAllByText('برچسب تصویر')).toHaveLength(3);
  });

  it('does not render an empty gallery', () => {
    const { container } = render(<ImageGallery images={[]} />);

    expect(container.childElementCount).toBe(0);
  });
});
