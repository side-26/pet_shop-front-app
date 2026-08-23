export type ProductListItem = Readonly<{
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  animal: string;
  category: string;
  rating: number;
  price: number;
  previousPrice?: number;
  discount?: string;
  available: boolean;
}>;

export const productListItems: readonly ProductListItem[] = [
  {
    id: 'adult-dog-food',
    title: 'غذای خشک سگ بالغ رویال کنین مدل مینی ادالت وزن ۲ کیلوگرم',
    image: '/images/home/product-dog-food.jpg',
    imageAlt: 'بسته غذای خشک سگ بالغ رویال کنین',
    animal: 'سگ',
    category: 'غذای خشک',
    rating: 4.8,
    price: 1020000,
    previousPrice: 1200000,
    discount: '۱۵٪',
    available: true,
  },
  {
    id: 'wet-food',
    title: 'کنسرو غذای تر گربه با طعم مرغ و سبزیجات',
    image: '/images/home/product-wet-food.jpg',
    imageAlt: 'کنسرو غذای تر گربه',
    animal: 'گربه',
    category: 'غذای تر',
    rating: 4.7,
    price: 350000,
    available: true,
  },
  {
    id: 'rope-toy',
    title: 'اسباب‌بازی طنابی مقاوم سگ مدل گره‌ای',
    image: '/images/home/product-rope-toys.jpg',
    imageAlt: 'اسباب‌بازی طنابی رنگی برای سگ',
    animal: 'سگ',
    category: 'اسباب‌بازی',
    rating: 4.5,
    price: 450000,
    available: true,
  },
  {
    id: 'water-fountain',
    title: 'آبخوری اتوماتیک حیوانات خانگی مدل چشمه',
    image: '/images/home/product-water-fountain.jpg',
    imageAlt: 'آبخوری اتوماتیک سفید حیوانات خانگی',
    animal: 'سگ و گربه',
    category: 'آبخوری',
    rating: 4.9,
    price: 1680000,
    available: false,
  },
  {
    id: 'cat-litter',
    title: 'خاک گربه کربن‌دار با جذب سریع بو وزن ۱۰ کیلوگرم',
    image: '/images/home/product-cat-litter.jpg',
    imageAlt: 'بسته خاک گربه کربن‌دار',
    animal: 'گربه',
    category: 'بهداشت',
    rating: 4.6,
    price: 590000,
    previousPrice: 650000,
    discount: '۹٪',
    available: true,
  },
  {
    id: 'puppy-food',
    title: 'غذای خشک توله سگ با پروتئین بالا وزن ۱.۵ کیلوگرم',
    image: '/images/home/product-dog-food.jpg',
    imageAlt: 'غذای خشک مخصوص توله سگ',
    animal: 'سگ',
    category: 'غذای خشک',
    rating: 4.4,
    price: 890000,
    available: true,
  },
  {
    id: 'cat-treat',
    title: 'تشویقی نرم گربه با طعم سالمون بسته ۶۰ گرمی',
    image: '/images/home/product-wet-food.jpg',
    imageAlt: 'تشویقی سالمون مخصوص گربه',
    animal: 'گربه',
    category: 'تشویقی',
    rating: 4.3,
    price: 275000,
    available: true,
  },
  {
    id: 'dental-toy',
    title: 'اسباب‌بازی دندانی سگ مناسب نژادهای متوسط',
    image: '/images/home/product-rope-toys.jpg',
    imageAlt: 'اسباب‌بازی دندانی سگ',
    animal: 'سگ',
    category: 'اسباب‌بازی',
    rating: 4.2,
    price: 320000,
    available: true,
  },
] as const;
