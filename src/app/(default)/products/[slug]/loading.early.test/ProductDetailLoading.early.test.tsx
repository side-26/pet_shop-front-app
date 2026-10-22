import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ProductDetailLoading from '../loading';

type MockRichTextFormValue = {
  mockText: string;
};
type MockProductDetailWeightViewModel = {
  id: string;
  label: string;
  cartWeight: {
    weight: number;
    unit: string;
  };
  price: number;
  discountPercentage: number;
  quantity: number;
};
type MockLandingProductDetailDTO = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: MockRichTextFormValue;
  descriptionText: string;
  category: {
    id: string;
    petType: {
      id: string;
      displayName: string;
      propertyDefinitions: Array<{ label: string; value: string }>;
    };
  };
  subCategory: {
    id: string;
    title: string;
  };
  brand: string;
  userRate: number;
  userRateCount: number;
  price: number;
  discountPercentage: number;
  quantity: number;
  mainImage: string;
  mainImageThumbnail: string;
  images: string[];
  weights: MockProductDetailWeightViewModel[];
  canVote: boolean;
  hasRated: boolean;
};

describe('ProductDetailLoading() ProductDetailLoading method', () => {
  describe('Happy Paths', () => {
    it('renders the skeleton product detail content with all expected sections', () => {
      render(<ProductDetailLoading />);
      const article = screen.getByRole('article');
      expect(article).toBeTruthy();
      expect(article.getAttribute('data-product-detail-shell')).toBe('');
      expect(article.getAttribute('aria-busy')).toBe('true');
      expect(article.classList.contains('skeleton')).toBe(true);

      expect(screen.getByText('خانه')).toBeTruthy();
      expect(screen.getByText('محصولات')).toBeTruthy();

      expect(screen.getByRole('heading', { level: 1 })).toBeTruthy();

      expect(screen.getAllByLabelText(/گالری تصاویر/)).toHaveLength(2);

      expect(screen.getByLabelText('خلاصه محصول')).toBeTruthy();

      expect(screen.getByLabelText('اطلاعات تکمیلی محصول')).toBeTruthy();

      expect(screen.getByLabelText('خرید محصول')).toBeTruthy();

      expect(screen.getByText(/امتیاز شما/)).toBeTruthy();
    });

    it('renders product information section with skeleton-only text', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText('وضعیت امتیازدهی کاربر در حال دریافت است.')).toBeTruthy();
    });

    it('renders product summary section with collapsed and expanded views', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText('خلاصه محصول')).toBeTruthy();

      expect(screen.getByRole('heading', { name: 'خلاصه محصول', level: 2 })).toBeTruthy();
    });

    it('renders product detail tabs with overview and specifications', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText('معرفی محصول')).toBeTruthy();
      expect(screen.getByText('مشخصات')).toBeTruthy();
    });

    it('renders product purchase sidebar and mobile purchase section', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByLabelText('خرید محصول')).toBeTruthy();
      expect(screen.getByText('امتیاز شما')).toBeTruthy();
    });

    it('renders product header actions with wishlist and share buttons', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByLabelText('افزودن محصول به علاقه‌مندی‌ها')).toBeTruthy();
      expect(screen.getByLabelText('اشتراک‌گذاری محصول')).toBeTruthy();
    });

    it('renders product rating and review count', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText(/نظر/)).toBeTruthy();
      expect(
        screen.getByText((content, element) => {
          return element?.tagName === 'BDI';
        }),
      ).toBeTruthy();
    });

    it('renders product availability status', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText(/موجود در انبار|ناموجود/)).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    it('renders with minimal skeleton data (empty summary, no specifications)', async () => {
      const minimalSkeleton: MockLandingProductDetailDTO = {
        id: 'min-id',
        slug: 'min-slug',
        title: 'حداقل محصول',
        summary: '',
        description: { mockText: '' },
        descriptionText: '',
        category: {
          id: 'cat-id',
          petType: {
            id: 'pet-id',
            displayName: '',
            propertyDefinitions: [],
          },
        },
        subCategory: {
          id: 'subcat-id',
          title: '',
        },
        brand: '',
        userRate: 0,
        userRateCount: 0,
        price: 0,
        discountPercentage: 0,
        quantity: 0,
        mainImage: '',
        mainImageThumbnail: '',
        images: [],
        weights: [],
        canVote: false,
        hasRated: false,
      };

      vi.resetModules();
      vi.doMock('../_components/product-detail-data', () => ({
        productDetailSkeleton: minimalSkeleton as any,
        __esModule: true,
      }));

      const { default: ProductDetailLoadingMinimal } = await import('../loading');

      render(<ProductDetailLoadingMinimal />);
      expect(screen.getByRole('article')).toBeTruthy();

      expect(screen.queryByLabelText('خلاصه محصول')).not.toBeTruthy();

      expect(screen.queryByText('مشخصات')).not.toBeTruthy();

      expect(screen.queryByText('معرفی محصول')).not.toBeTruthy();
    });

    it('renders with multiple images and verifies image gallery behavior', async () => {
      const multiImageSkeleton: MockLandingProductDetailDTO = {
        id: 'multi-id',
        slug: 'multi-slug',
        title: 'محصول چندتصویری',
        summary: 'خلاصه چندتصویری',
        description: { mockText: 'توضیحات چندتصویری' },
        descriptionText: 'توضیحات چندتصویری',
        category: {
          id: 'cat-id',
          petType: {
            id: 'pet-id',
            displayName: 'حیوان',
            propertyDefinitions: [{ label: 'وزن', value: '10kg' }],
          },
        },
        subCategory: {
          id: 'subcat-id',
          title: 'زیرگروه',
        },
        brand: 'برند',
        userRate: 4.5,
        userRateCount: 10,
        price: 1000,
        discountPercentage: 10,
        quantity: 5,
        mainImage: 'main.jpg',
        mainImageThumbnail: 'main-thumb.jpg',
        images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
        weights: [
          {
            id: 'w1',
            label: 'وزن 1',
            cartWeight: { weight: 1, unit: 'kg' },
            price: 1000,
            discountPercentage: 10,
            quantity: 5,
          },
        ],
        canVote: true,
        hasRated: false,
      };

      vi.resetModules();
      vi.doMock('../_components/product-detail-data', () => ({
        productDetailSkeleton: multiImageSkeleton as any,
        __esModule: true,
      }));

      const { default: ProductDetailLoadingMultiImage } = await import('../loading');

      render(<ProductDetailLoadingMultiImage />);
      expect(screen.getAllByLabelText(/گالری تصاویر/)).toHaveLength(2);

      expect(screen.getByRole('button', { name: /previous/i })).toBeTruthy();
      expect(screen.getByRole('button', { name: /next/i })).toBeTruthy();

      expect(screen.getAllByRole('img')).toHaveLength(3);
    });

    it('renders product information section with missing animal, category, and subcategory', async () => {
      const missingInfoSkeleton: MockLandingProductDetailDTO = {
        id: 'missing-id',
        slug: 'missing-slug',
        title: 'محصول بدون اطلاعات',
        summary: 'خلاصه',
        description: { mockText: 'توضیحات' },
        descriptionText: 'توضیحات',
        category: {
          id: 'cat-id',
          petType: {
            id: '',
            displayName: '',
            propertyDefinitions: [],
          },
        },
        subCategory: {
          id: '',
          title: '',
        },
        brand: '',
        userRate: 0,
        userRateCount: 0,
        price: 0,
        discountPercentage: 0,
        quantity: 0,
        mainImage: '',
        mainImageThumbnail: '',
        images: [],
        weights: [],
        canVote: false,
        hasRated: false,
      };

      vi.resetModules();
      vi.doMock('../_components/product-detail-data', () => ({
        productDetailSkeleton: missingInfoSkeleton as any,
        __esModule: true,
      }));

      const { default: ProductDetailLoadingMissingInfo } = await import('../loading');

      render(<ProductDetailLoadingMissingInfo />);
      expect(screen.queryByText('حیوان')).not.toBeTruthy();
      expect(screen.queryByText('زیرگروه')).not.toBeTruthy();
      expect(screen.queryByText('برند')).not.toBeTruthy();
    });

    it('renders product purchase controls with no weights', async () => {
      const noWeightsSkeleton: MockLandingProductDetailDTO = {
        id: 'no-weights-id',
        slug: 'no-weights-slug',
        title: 'محصول بدون وزن',
        summary: 'خلاصه',
        description: { mockText: 'توضیحات' },
        descriptionText: 'توضیحات',
        category: {
          id: 'cat-id',
          petType: {
            id: 'pet-id',
            displayName: 'حیوان',
            propertyDefinitions: [],
          },
        },
        subCategory: {
          id: 'subcat-id',
          title: 'زیرگروه',
        },
        brand: 'برند',
        userRate: 3,
        userRateCount: 2,
        price: 500,
        discountPercentage: 5,
        quantity: 2,
        mainImage: 'main.jpg',
        mainImageThumbnail: 'main-thumb.jpg',
        images: ['img1.jpg'],
        weights: [],
        canVote: true,
        hasRated: false,
      };

      vi.resetModules();
      vi.doMock('../_components/product-detail-data', () => ({
        productDetailSkeleton: noWeightsSkeleton as any,
        __esModule: true,
      }));

      const { default: ProductDetailLoadingNoWeights } = await import('../loading');

      render(<ProductDetailLoadingNoWeights />);
      expect(screen.getByLabelText('خرید محصول')).toBeTruthy();
    });
  });
});
