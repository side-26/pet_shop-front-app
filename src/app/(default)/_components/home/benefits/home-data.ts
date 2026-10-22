import { HeartPulse, PawPrint, Soup, UsersRound, type LucideIcon } from 'lucide-react';

export type HomeBenefit = Readonly<{
  title: string;
  description: string;
  icon: LucideIcon;
  color: 'primary' | 'secondary' | 'info';
}>;

export type PetCategory = Readonly<{
  title: string;
  description: string;
  image: string;
  imageAlt: string;
}>;

export type FeaturedProduct = Readonly<{
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  discount: string;
  previousPrice: string;
  currentPrice: string;
}>;

export const homeBenefits: readonly HomeBenefit[] = [
  {
    title: 'تغذیه باکیفیت',
    description:
      'پیدا کردن غذای مناسب و اورجینال دغدغه بزرگی است. ما اصالت و کیفیت محصولات غذایی را تضمین می‌کنیم.',
    icon: Soup,
    color: 'primary',
  },
  {
    title: 'پیگیری سلامت',
    description:
      'با ثبت واکسیناسیون و یادآورهای سلامت، چکاپ‌های دوره‌ای دوست کوچک شما به‌موقع انجام می‌شود.',
    icon: HeartPulse,
    color: 'secondary',
  },
  {
    title: 'اجتماع دوست‌داران پت',
    description:
      'فضایی امن برای ارتباط با صاحبان حیوانات، تبادل تجربه و پیدا کردن همبازی مناسب برای پت شما.',
    icon: UsersRound,
    color: 'info',
  },
] as const;

export const benefitIconStyles = {
  primary: 'tw:bg-primary-muted tw:text-primary-muted-foreground',
  secondary: 'tw:bg-secondary-muted tw:text-secondary-muted-foreground',
  info: 'tw:bg-info-muted tw:text-info-muted-foreground',
} as const;

export const heroHighlights = [
  { label: 'انتخاب حرفه‌ای', icon: PawPrint },
  { label: 'مراقبت مطمئن', icon: HeartPulse },
] as const;
