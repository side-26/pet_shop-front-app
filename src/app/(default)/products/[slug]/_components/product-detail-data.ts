export type ProductGalleryImage = Readonly<{
  src: string;
  alt: string;
  fit?: 'cover' | 'contain';
}>;

export type ProductDetail = Readonly<{
  slug: string;
  title: string;
  animal: string;
  category: string;
  brand: string;
  rating: number;
  reviewCount: number;
  weight: string;
  weights: readonly Readonly<{ value: string; label: string }>[];
  price: number;
  previousPrice: number;
  discount: string;
  stock: number;
  images: readonly ProductGalleryImage[];
  description: string;
}>;

const royalCaninMaxiAdult: ProductDetail = {
  slug: 'adult-dog-food',
  title: 'غذای خشک سگ مدل رویال کنین Maxi Adult',
  animal: 'سگ',
  category: 'غذای خشک',
  brand: 'رویال کنین',
  rating: 4.8,
  reviewCount: 120,
  weight: '۱۵ کیلوگرم',
  weights: [
    { value: '15kg', label: '۱۵ کیلوگرم' },
    { value: '4kg', label: '۴ کیلوگرم' },
  ],
  price: 2975000,
  previousPrice: 3500000,
  discount: '۱۵٪ تخفیف',
  stock: 3,
  images: [
    {
      src: '/images/home/product-dog-food.jpg',
      alt: 'بسته غذای خشک سگ بالغ رویال کنین',
      fit: 'contain',
    },
    {
      src: '/images/home/category-dog.jpg',
      alt: 'سگ جوان سالم در فضای باز',
    },
    {
      src: '/images/home/delivery.jpg',
      alt: 'بسته‌بندی و ارسال محصولات پناهگاه پرشین',
    },
  ],
  description:
    'غذای خشک سگ رویال کنین مدل مکسی ادالت (Maxi Adult) مخصوص سگ‌های نژاد بزرگ (وزن ۲۶ تا ۴۴ کیلوگرم) در سنین ۱۵ ماهگی تا ۵ سالگی طراحی شده است. این محصول با ترکیبی متعادل از فیبرهای رژیمی و پروتئین‌های با قابلیت هضم بالا، به سلامت دستگاه گوارش کمک شایانی می‌کند. همچنین فرمولاسیون ویژه آن غنی از اسیدهای چرب امگا ۳ (EPA و DHA) است که برای حفظ سلامت پوست و درخشندگی موها ضروری می‌باشند. دانه‌های این غذا متناسب با فک سگ‌های بزرگ طراحی شده تا جویدن را تسهیل کند.',
};

const productDetails = new Map([[royalCaninMaxiAdult.slug, royalCaninMaxiAdult]]);

export function getProductDetail(slug: string) {
  return productDetails.get(slug);
}

export function getProductDetailSlugs() {
  return [...productDetails.keys()];
}
