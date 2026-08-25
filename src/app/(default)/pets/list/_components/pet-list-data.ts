export type PetListItem = Readonly<{
  id: string;
  name: string;
  image: string;
  imageAlt: string;
  type: string;
  breed: string;
  age: string;
  sex: 'نر' | 'ماده';
  location: string;
  price: number;
  available: boolean;
}>;

export const petListItems: readonly PetListItem[] = [
  {
    id: 'max',
    name: 'مکس',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'مکس، توله گلدن رتریور در فضای سبز',
    type: 'سگ',
    breed: 'گلدن رتریور',
    age: '۶ ماهه',
    sex: 'نر',
    location: 'تهران',
    price: 15000000,
    available: true,
  },
  {
    id: 'barfi',
    name: 'برفی',
    image: '/images/home/category-cat.jpg',
    imageAlt: 'برفی، گربه پرشین سفید',
    type: 'گربه',
    breed: 'پرشین',
    age: '۱ ساله',
    sex: 'ماده',
    location: 'کرج',
    price: 12500000,
    available: true,
  },
  {
    id: 'teddy',
    name: 'تدی',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'تدی، توله گلدن رتریور بازیگوش',
    type: 'سگ',
    breed: 'گلدن رتریور',
    age: '۸ ماهه',
    sex: 'نر',
    location: 'تهران',
    price: 16000000,
    available: true,
  },
  {
    id: 'pashmak',
    name: 'پشمک',
    image: '/images/home/category-cat.jpg',
    imageAlt: 'پشمک، گربه پرشین آرام',
    type: 'گربه',
    breed: 'پرشین',
    age: '۲ ساله',
    sex: 'ماده',
    location: 'رشت',
    price: 11000000,
    available: false,
  },
  {
    id: 'fandogh',
    name: 'فندق',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'فندق، توله سگ میکس بیگل',
    type: 'سگ',
    breed: 'میکس بیگل',
    age: '۲ ماهه',
    sex: 'نر',
    location: 'قزوین',
    price: 8500000,
    available: true,
  },
  {
    id: 'nabat',
    name: 'نبات',
    image: '/images/home/category-cat.jpg',
    imageAlt: 'نبات، بچه گربه خاکستری',
    type: 'گربه',
    breed: 'DSH',
    age: '۳ ماهه',
    sex: 'ماده',
    location: 'تهران',
    price: 6000000,
    available: true,
  },
  {
    id: 'toti',
    name: 'طوطی',
    image: '/images/home/category-bird.jpg',
    imageAlt: 'مرغ عشق رنگارنگ',
    type: 'پرنده',
    breed: 'مرغ عشق',
    age: '۱ ساله',
    sex: 'نر',
    location: 'اصفهان',
    price: 3200000,
    available: true,
  },
  {
    id: 'pico',
    name: 'پیکو',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'پیکو، توله سگ میکس بیگل',
    type: 'سگ',
    breed: 'میکس بیگل',
    age: '۴ ماهه',
    sex: 'نر',
    location: 'شیراز',
    price: 9000000,
    available: true,
  },
] as const;
