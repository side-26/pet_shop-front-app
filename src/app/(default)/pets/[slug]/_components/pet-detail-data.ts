export type PetDetailImage = Readonly<{
  src: string;
  alt: string;
}>;

export type PetDetail = Readonly<{
  slug: string;
  name: string;
  type: string;
  breed: string;
  age: string;
  sex: 'نر' | 'ماده';
  color: string;
  weight: string;
  location: string;
  price: number;
  status: string;
  description: string;
  images: readonly PetDetailImage[];
}>;

const max: PetDetail = {
  slug: 'max',
  name: 'مکس',
  type: 'سگ',
  breed: 'گلدن رتریور',
  age: '۶ ماهه',
  sex: 'نر',
  color: 'طلایی',
  weight: '۱۲ کیلوگرم',
  location: 'تهران، سعادت‌آباد',
  price: 15000000,
  status: 'آماده واگذاری',
  description:
    'مکس یک توله گلدن رتریور مهربان، اجتماعی و پرانرژی است. واکسیناسیون او کامل شده و به‌خوبی با کودکان و حیوانات دیگر ارتباط می‌گیرد. مکس برای خانواده‌ای که زمان کافی برای بازی، پیاده‌روی و آموزش روزانه دارد، همراهی دوست‌داشتنی خواهد بود.',
  images: [
    { src: '/images/home/category-dog.jpg', alt: 'مکس، توله گلدن رتریور در فضای سبز' },
    { src: '/images/home/delivery.jpg', alt: 'مکس در محیط آرام خانه' },
    { src: '/images/home/hero-pets.png', alt: 'مکس در کنار دیگر حیوانات خانگی' },
  ],
};

export const petDetailSkeleton: PetDetail = {
  ...max,
  slug: 'loading-pet',
  name: 'در حال بارگذاری',
  breed: 'نژاد حیوان خانگی',
  location: 'موقعیت حیوان خانگی',
  description: 'اطلاعات کامل حیوان خانگی، وضعیت سلامت و شرایط واگذاری در حال بارگذاری است.',
};

const petDetails = new Map([[max.slug, max]]);

export function getPetDetail(slug: string) {
  return petDetails.get(slug);
}

export function getPetDetailSlugs() {
  return [...petDetails.keys()];
}
