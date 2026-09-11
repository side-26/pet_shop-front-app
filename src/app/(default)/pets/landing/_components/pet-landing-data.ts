import { type LucideIcon } from 'lucide-react';

export type PopularPet = Readonly<{
  name: string;
  details: string;
  price: string;
  image: string;
  imageAlt: string;
}>;

export const popularPets: readonly PopularPet[] = [
  {
    name: 'مکس',
    details: 'گلدن رتریور • ۶ ماهه',
    price: '۱۵,۰۰۰,۰۰۰',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'مکس، توله گلدن رتریور در فضای سبز',
  },
  {
    name: 'برفی',
    details: 'پرشین • ۱ ساله',
    price: '۱۲,۵۰۰,۰۰۰',
    image: '/images/home/category-cat.jpg',
    imageAlt: 'برفی، گربه پرشین سفید روی بالشت',
  },
  {
    name: 'تدی',
    details: 'گلدن رتریور • ۸ ماهه',
    price: '۱۶,۰۰۰,۰۰۰',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'تدی، توله گلدن رتریور بازیگوش',
  },
  {
    name: 'پشمک',
    details: 'پرشین • ۲ ساله',
    price: '۱۱,۰۰۰,۰۰۰',
    image: '/images/home/category-cat.jpg',
    imageAlt: 'پشمک، گربه پرشین سفید و آرام',
  },
] as const;
