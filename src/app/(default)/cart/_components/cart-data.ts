export type CartItem = Readonly<{
  id: string;
  title: string;
  image: string;
  imageAlt: string;
  detail: string;
  price: number;
  previousPrice?: number;
  discount?: string;
  quantity: number;
  stock: number;
}>;

export const initialCartItems: readonly CartItem[] = [
  {
    id: 'adult-dog-food',
    title: 'غذای خشک سگ مدل رویال کنین Maxi Adult',
    image: '/images/home/product-dog-food.jpg',
    imageAlt: 'بسته غذای خشک سگ بالغ رویال کنین',
    detail: 'وزن ۱۵ کیلوگرم',
    price: 2_975_000,
    previousPrice: 3_500_000,
    discount: '۱۵٪ تخفیف',
    quantity: 1,
    stock: 3,
  },
  {
    id: 'wet-food',
    title: 'کنسرو غذای تر گربه با طعم مرغ و سبزیجات',
    image: '/images/home/product-wet-food.jpg',
    imageAlt: 'کنسرو غذای تر گربه',
    detail: 'بسته ۱۲ عددی',
    price: 350_000,
    quantity: 2,
    stock: 8,
  },
  {
    id: 'rope-toy',
    title: 'اسباب‌بازی طنابی مقاوم سگ مدل گره‌ای',
    image: '/images/home/product-rope-toys.jpg',
    imageAlt: 'اسباب‌بازی طنابی رنگی برای سگ',
    detail: 'سایز متوسط',
    price: 450_000,
    quantity: 1,
    stock: 5,
  },
] as const;
