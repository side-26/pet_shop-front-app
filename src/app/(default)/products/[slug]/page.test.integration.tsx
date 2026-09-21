import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { LandingProductDetailDTO } from '@/entities/landing/landing.dto';
import { routePaths } from '@/configs/route.path';
import {
  getLandingProductBySlugAction,
  getPublicLandingProductBySlugAction,
} from '@/entities/landing/landing.actions';

import { ProductDetailContainer } from './_components/product-detail-container';
import { ProductPurchaseControls } from './_components/product-purchase-controls';
import { generateMetadata } from './page';

vi.mock('@/entities/landing/landing.actions', () => ({
  getLandingProductBySlugAction: vi.fn(),
  getPublicLandingProductBySlugAction: vi.fn(),
}));
vi.mock('@/components/ui/carousel', () => ({
  Carousel: ({ children, ...props }: { children: ReactNode }) => <div {...props}>{children}</div>,
  CarouselContent: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  CarouselItem: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));
vi.mock('@/components/ui/rich-text', () => ({
  RichText: () => <div aria-label="توضیحات محصول">متن معرفی محصول</div>,
}));

const product = {
  id: '6a9fcb6871b632040de16436',
  slug: 'product-0de16436',
  title: 'تشویقی آموزشی سگ با طعم گوشت',
  mainImage: 'https://s3.ir-thr-at1.arvanstorage.ir/pet-shop/products/main/product.webp',
  mainImageThumbnail: 'data:image/webp;base64,AAAA',
  images: [],
  summary: 'تشویقی مناسب آموزش سگ',
  description: {
    type: 'doc',
    content: [{ type: 'paragraph', content: [{ type: 'text', text: 'متن معرفی محصول' }] }],
  },
  quantity: 3,
  weights: [{ _id: 'weight-1', metric: 'KG', quantity: 3, value: 4 }],
  userRate: 4.5,
  userRateCount: 12,
  price: 4_560_000,
  discountPercentage: 5,
  isEnable: true,
  category: {
    id: 'category-1',
    title: 'تشویقی و اسنک',
    petType: {
      id: 'pet-type-1',
      title: 'سگ',
      displayName: 'سگ',
      propertyDefinitions: [{ label: 'رنگ', value: 'نارنجی' }],
    },
  },
  brand: { id: 'brand-1', title: 'Hills', title_fa: 'هیلز' },
  subCategory: { id: 'subcategory-1', title: 'تشویقی آموزشی' },
  canVote: false,
  hasRated: false,
} satisfies LandingProductDetailDTO;

beforeEach(() => {
  vi.mocked(getLandingProductBySlugAction).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: product,
  });
  vi.mocked(getPublicLandingProductBySlugAction).mockResolvedValue({
    isSuccess: true,
    message: null,
    data: product,
  });
  vi.stubGlobal(
    'ResizeObserver',
    class ResizeObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(cleanup);

describe('/products/product-0de16436', () => {
  it('streams the API-backed product journey with inventory, taxonomy and specifications', async () => {
    const content = await ProductDetailContainer({
      productPromise: Promise.resolve({ isSuccess: true, message: null, data: product }),
      slugPromise: Promise.resolve(product.slug),
    });
    render(content);

    expect(screen.getByRole('heading', { level: 1, name: product.title })).toBeTruthy();
    expect(screen.getAllByText('سگ')).toHaveLength(2);
    expect(screen.getAllByText('تشویقی و اسنک')).toHaveLength(2);
    expect(screen.getAllByText('تشویقی آموزشی')).toHaveLength(2);
    for (const link of screen.getAllByRole('link', { name: 'سگ' })) {
      expect(link.getAttribute('href')).toBe(
        routePaths.productsListByPetType(product.category.petType.id),
      );
    }
    for (const link of screen.getAllByRole('link', { name: 'تشویقی و اسنک' })) {
      expect(link.getAttribute('href')).toBe(
        routePaths.productsListByCategory(product.category.id),
      );
    }
    for (const link of screen.getAllByRole('link', { name: 'تشویقی آموزشی' })) {
      expect(link.getAttribute('href')).toBe(
        routePaths.productsListBySubCategory(product.subCategory.id),
      );
    }
    expect(screen.getAllByText('تنها ۳ عدد از این محصول باقی مانده است.')).toHaveLength(2);
    expect(screen.getAllByRole('group', { name: 'انتخاب وزن' })).toHaveLength(2);
    expect(screen.getByRole('tab', { name: 'معرفی محصول' })).toBeTruthy();
    fireEvent.click(screen.getByRole('tab', { name: 'مشخصات' }));
    expect(screen.getAllByText('رنگ')).toHaveLength(2);
  });

  it('builds metadata from the public cached product response', async () => {
    const metadata = await generateMetadata({ params: Promise.resolve({ slug: product.slug }) });

    expect(metadata.title).toBe(`${product.title} | پت شاپ پرشین`);
    expect(metadata.alternates?.canonical).toBe(`/products/${product.slug}`);
  });

  it('only exposes the exact inventory count when stock is low', () => {
    const { rerender } = render(
      <ProductPurchaseControls mode="desktop" price={product.price} quantity={8} />,
    );

    expect(screen.queryByText(/موجودی:/)).toBeNull();

    rerender(<ProductPurchaseControls mode="desktop" price={product.price} quantity={7} />);

    expect(screen.getByText('موجودی: ۷')).toBeTruthy();
  });

  it('keeps mobile weight selection, pricing, and inventory in the purchase dock', () => {
    render(
      <ProductPurchaseControls
        mode="mobile"
        price={500_000}
        quantity={3}
        weights={[
          {
            id: 'weight-1',
            label: '۱ کیلوگرم',
            price: 500_000,
            discountPercentage: 10,
            quantity: 3,
          },
          {
            id: 'weight-2',
            label: '۲ کیلوگرم',
            price: 900_000,
            discountPercentage: 20,
            quantity: 1,
          },
        ]}
      />,
    );

    expect(screen.getByText('۴۵۰٬۰۰۰')).toBeTruthy();
    expect(screen.getByText('۵۰۰٬۰۰۰')).toBeTruthy();
    expect(
      screen
        .getByTestId('mobile-purchase-controls')
        .querySelector('[data-slot="mobile-price-column"]'),
    ).toBeTruthy();
    expect(screen.getByText('تنها ۳ عدد از این محصول باقی مانده است.')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'افزودن به سبد خرید' }));

    expect(screen.getByRole('group', { name: 'تعداد محصول' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'کاهش تعداد' }).hasAttribute('disabled')).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: 'افزایش تعداد' }));

    expect(screen.getByText('۴۵۰٬۰۰۰')).toBeTruthy();
    expect(screen.getByText('۵۰۰٬۰۰۰')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'حذف از سبد خرید' }));

    expect(screen.getByRole('button', { name: 'افزودن به سبد خرید' })).toBeTruthy();

    fireEvent.click(screen.getByText('۲ کیلوگرم'));

    expect(screen.getByText('۷۲۰٬۰۰۰')).toBeTruthy();
    expect(screen.getByText('تنها ۱ عدد از این محصول باقی مانده است.')).toBeTruthy();
  });
});
