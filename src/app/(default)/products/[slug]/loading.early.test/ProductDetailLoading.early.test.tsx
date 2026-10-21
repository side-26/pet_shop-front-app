import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
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
      expect(article).toBeInTheDocument();
      expect(article).toHaveAttribute('data-product-detail-shell');
      expect(article).toHaveAttribute('aria-busy', 'true');
      expect(article).toHaveClass('skeleton');

      expect(screen.getByText('خانه')).toBeInTheDocument();
      expect(screen.getByText('محصولات')).toBeInTheDocument();

      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();

      expect(screen.getAllByLabelText(/گالری تصاویر/)).toHaveLength(2);

      expect(screen.getByLabelText('خلاصه محصول')).toBeInTheDocument();

      expect(screen.getByLabelText('اطلاعات تکمیلی محصول')).toBeInTheDocument();

      expect(screen.getByLabelText('خرید محصول')).toBeInTheDocument();

      expect(screen.getByText(/امتیاز شما/)).toBeInTheDocument();
    });

    it('renders product information section with skeleton-only text', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText('وضعیت امتیازدهی کاربر در حال دریافت است.')).toBeInTheDocument();
    });

    it('renders product summary section with collapsed and expanded views', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText('خلاصه محصول')).toBeInTheDocument();

      expect(screen.getByRole('heading', { name: 'خلاصه محصول', level: 2 })).toBeInTheDocument();
    });

    it('renders product detail tabs with overview and specifications', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText('معرفی محصول')).toBeInTheDocument();
      expect(screen.getByText('مشخصات')).toBeInTheDocument();
    });

    it('renders product purchase sidebar and mobile purchase section', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByLabelText('خرید محصول')).toBeInTheDocument();
      expect(screen.getByText('امتیاز شما')).toBeInTheDocument();
    });

    it('renders product header actions with wishlist and share buttons', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByLabelText('افزودن محصول به علاقه‌مندی‌ها')).toBeInTheDocument();
      expect(screen.getByLabelText('اشتراک‌گذاری محصول')).toBeInTheDocument();
    });

    it('renders product rating and review count', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText(/نظر/)).toBeInTheDocument();
      expect(
        screen.getByText((content, element) => {
          return element?.tagName === 'BDI';
        }),
      ).toBeInTheDocument();
    });

    it('renders product availability status', () => {
      render(<ProductDetailLoading />);
      expect(screen.getByText(/موجود در انبار|ناموجود/)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('renders with minimal skeleton data (empty summary, no specifications)', () => {
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

      jest.mock('../_components/product-detail-data', () => ({
        productDetailSkeleton: minimalSkeleton as any,
        __esModule: true,
      }));

      const { default: ProductDetailLoadingMinimal } = require('../loading');

      render(<ProductDetailLoadingMinimal />);
      expect(screen.getByRole('article')).toBeInTheDocument();

      expect(screen.queryByLabelText('خلاصه محصول')).not.toBeInTheDocument();

      expect(screen.queryByText('مشخصات')).not.toBeInTheDocument();

      expect(screen.queryByText('معرفی محصول')).not.toBeInTheDocument();
    });

    it('renders with multiple images and verifies image gallery behavior', () => {
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

      jest.mock('../_components/product-detail-data', () => ({
        productDetailSkeleton: multiImageSkeleton as any,
        __esModule: true,
      }));

      const { default: ProductDetailLoadingMultiImage } = require('../loading');

      render(<ProductDetailLoadingMultiImage />);
      expect(screen.getAllByLabelText(/گالری تصاویر/)).toHaveLength(2);

      expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();

      expect(screen.getAllByRole('img')).toHaveLength(3);
    });

    it('renders product information section with missing animal, category, and subcategory', () => {
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

      jest.mock('../_components/product-detail-data', () => ({
        productDetailSkeleton: missingInfoSkeleton as any,
        __esModule: true,
      }));

      const { default: ProductDetailLoadingMissingInfo } = require('../loading');

      render(<ProductDetailLoadingMissingInfo />);
      expect(screen.queryByText('حیوان')).not.toBeInTheDocument();
      expect(screen.queryByText('زیرگروه')).not.toBeInTheDocument();
      expect(screen.queryByText('برند')).not.toBeInTheDocument();
    });

    it('renders product purchase controls with no weights', () => {
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

      jest.mock('../_components/product-detail-data', () => ({
        productDetailSkeleton: noWeightsSkeleton as any,
        __esModule: true,
      }));

      const { default: ProductDetailLoadingNoWeights } = require('../loading');

      render(<ProductDetailLoadingNoWeights />);
      expect(screen.getByLabelText('خرید محصول')).toBeInTheDocument();
    });
  });
});
