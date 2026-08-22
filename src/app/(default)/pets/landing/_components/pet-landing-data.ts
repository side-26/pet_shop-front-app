import { Bird, Cat, Dog, Fish, Shapes, Snail, type LucideIcon } from 'lucide-react';

type PetType = Readonly<{
  name: string;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning';
}>;

export type PopularPet = Readonly<{
  name: string;
  details: string;
  price: string;
  image: string;
  imageAlt: string;
}>;

export type RehomingPet = Readonly<{
  name: string;
  details: string;
  image: string;
  imageAlt: string;
}>;

export const petTypes: readonly PetType[] = [
  { name: 'سگ‌ها', icon: Dog, color: 'primary' },
  { name: 'گربه‌ها', icon: Cat, color: 'secondary' },
  { name: 'پرندگان', icon: Bird, color: 'info' },
  { name: 'ماهی‌ها', icon: Fish, color: 'success' },
  { name: 'خزندگان', icon: Snail, color: 'warning' },
  { name: 'سایر', icon: Shapes, color: 'primary' },
] as const;

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

export const rehomingPets: readonly RehomingPet[] = [
  {
    name: 'فندق',
    details: 'میکس بیگل • ۲ ماهه',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'فندق، توله سگ میکس بیگل آماده واگذاری',
  },
  {
    name: 'نبات',
    details: 'DSH • ۳ ماهه',
    image: '/images/home/category-cat.jpg',
    imageAlt: 'نبات، بچه گربه آماده واگذاری',
  },
  {
    name: 'طوطی',
    details: 'مرغ عشق • ۱ ساله',
    image: '/images/home/category-bird.jpg',
    imageAlt: 'مرغ عشق رنگارنگ آماده واگذاری',
  },
  {
    name: 'پیکو',
    details: 'میکس بیگل • ۴ ماهه',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'پیکو، توله سگ میکس بیگل آماده واگذاری',
  },
] as const;

export const petTypeIconStyles = {
  primary: 'tw:bg-primary-muted tw:text-primary-muted-foreground',
  secondary: 'tw:bg-secondary-muted tw:text-secondary-muted-foreground',
  info: 'tw:bg-info-muted tw:text-info-muted-foreground',
  success: 'tw:bg-success-muted tw:text-success-muted-foreground',
  warning: 'tw:bg-warning-muted tw:text-warning-muted-foreground',
} as const;
