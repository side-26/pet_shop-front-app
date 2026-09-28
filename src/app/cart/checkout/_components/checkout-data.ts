export type CheckoutAddress = Readonly<{
  id: string;
  title: string;
  recipient: string;
  address: string;
  phone: string;
  postalCode: string;
  isDefault?: boolean;
}>;

export type DeliveryMethod = Readonly<{
  id: string;
  title: string;
  description: string;
  price: number;
  arrival: string;
}>;

export type DeliveryDate = Readonly<{
  id: string;
  weekday: string;
  date: string;
  methodIds: readonly string[];
  recommended?: boolean;
}>;

export type DeliveryTimeSlot = Readonly<{
  id: string;
  label: string;
  description: string;
}>;

export const checkoutAddresses: readonly CheckoutAddress[] = [
  {
    id: 'home',
    title: 'خانه',
    recipient: 'نیلوفر احمدی',
    address: 'تهران، سعادت‌آباد، بلوار دریا، خیابان صراف‌های جنوبی، پلاک ۲۴، واحد ۸',
    phone: '۰۹۱۲۱۲۳۴۵۶۷',
    postalCode: '۱۹۹۸۷۶۵۴۳۲',
    isDefault: true,
  },
  {
    id: 'work',
    title: 'محل کار',
    recipient: 'نیلوفر احمدی',
    address: 'تهران، میدان ونک، خیابان ملاصدرا، خیابان شیراز جنوبی، پلاک ۱۸',
    phone: '۰۹۱۲۱۲۳۴۵۶۷',
    postalCode: '۱۴۳۵۸۷۶۴۲۱',
  },
] as const;

export const deliveryMethods: readonly DeliveryMethod[] = [
  {
    id: 'standard',
    title: 'ارسال استاندارد',
    description: 'تحویل توسط پست پیشتاز',
    price: 0,
    arrival: 'شنبه ۸ شهریور',
  },
  {
    id: 'express',
    title: 'ارسال سریع',
    description: 'تحویل اختصاصی در بازه انتخابی',
    price: 120_000,
    arrival: 'پنجشنبه ۶ شهریور',
  },
] as const;

export const deliveryDates: readonly DeliveryDate[] = [
  {
    id: 'thu-6-shahrivar',
    weekday: 'پنجشنبه',
    date: '۶ شهریور',
    methodIds: ['express'],
    recommended: true,
  },
  {
    id: 'sat-8-shahrivar',
    weekday: 'شنبه',
    date: '۸ شهریور',
    methodIds: ['standard', 'express'],
    recommended: true,
  },
  {
    id: 'sun-9-shahrivar',
    weekday: 'یکشنبه',
    date: '۹ شهریور',
    methodIds: ['standard', 'express'],
  },
] as const;

export const deliveryTimeSlots: readonly DeliveryTimeSlot[] = [
  { id: 'morning', label: '۹ تا ۱۲', description: 'صبح' },
  { id: 'noon', label: '۱۲ تا ۱۵', description: 'ظهر' },
  { id: 'evening', label: '۱۵ تا ۱۸', description: 'عصر' },
] as const;

export const checkoutItems = [
  {
    id: 'adult-dog-food',
    title: 'غذای خشک سگ رویال کنین',
    image: '/images/home/product-dog-food.jpg',
    quantity: 1,
  },
  {
    id: 'wet-food',
    title: 'کنسرو غذای تر گربه',
    image: '/images/home/product-wet-food.jpg',
    quantity: 2,
  },
  {
    id: 'rope-toy',
    title: 'اسباب‌بازی طنابی سگ',
    image: '/images/home/product-rope-toys.jpg',
    quantity: 1,
  },
] as const;

export const checkoutTotals = {
  merchandise: 4_575_000,
  discount: 525_000,
  payable: 4_050_000,
} as const;
