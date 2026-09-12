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

export const petCategories: readonly PetCategory[] = [
  {
    title: 'گربه‌ها',
    description: 'غذای خشک، تشویقی و خاک',
    image: '/images/home/category-cat.jpg',
    imageAlt: 'گربه پرشین سفید روی بالشت مخملی',
  },
  {
    title: 'سگ‌ها',
    description: 'قلاده، اسباب‌بازی و مکمل',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'توله گلدن رتریور در فضای سبز',
  },
  {
    title: 'پرندگان',
    description: 'دان، قفس و ویتامین',
    image: '/images/home/category-bird.jpg',
    imageAlt: 'طوطی ماکائوی رنگارنگ روی استند چوبی',
  },
  {
    title: 'جوندگان',
    description: 'یونجه، پلت و بستر',
    image: '/images/home/category-hamster.jpg',
    imageAlt: 'همستر کوچک در حال خوردن دانه',
  },
] as const;

export const featuredProducts: readonly FeaturedProduct[] = [
  {
    title: 'غذای خشک سگ پرشین',
    description: 'مدل گورمت، مناسب سگ‌های بالغ',
    image: '/images/home/product-dog-food.jpg',
    imageAlt: 'بسته غذای خشک سگ پرشین پت هیون',
    discount: '۲۰٪ تخفیف',
    previousPrice: '۱٬۲۰۰٬۰۰۰',
    currentPrice: '۹۶۰٬۰۰۰',
  },
  {
    title: 'خاک گربه کربن‌دار',
    description: 'بسته ۱۰ لیتری با جذب بالا',
    image: '/images/home/product-cat-litter.jpg',
    imageAlt: 'بسته خاک گربه با طراحی روشن',
    discount: '۱۵٪ تخفیف',
    previousPrice: '۳۵۰٬۰۰۰',
    currentPrice: '۲۹۷٬۵۰۰',
  },
  {
    title: 'آب‌خوری هوشمند',
    description: 'فیلتر چندلایه و پمپ کم‌صدا',
    image: '/images/home/product-water-fountain.jpg',
    imageAlt: 'آب‌خوری هوشمند سفید حیوانات خانگی',
    discount: '۳۰٪ تخفیف',
    previousPrice: '۲٬۵۰۰٬۰۰۰',
    currentPrice: '۱٬۷۵۰٬۰۰۰',
  },
  {
    title: 'پک اسباب‌بازی دندانی',
    description: 'مقاوم و مناسب توله‌سگ‌ها',
    image: '/images/home/product-rope-toys.jpg',
    imageAlt: 'مجموعه اسباب‌بازی طنابی رنگی سگ',
    discount: '۱۰٪ تخفیف',
    previousPrice: '۴۵۰٬۰۰۰',
    currentPrice: '۴۰۵٬۰۰۰',
  },
  {
    title: 'کنسرو گربه مدل مرغ',
    description: 'قوطی ۸۵ گرمی با گوشت واقعی',
    image: '/images/home/product-wet-food.jpg',
    imageAlt: 'قوطی غذای تر گربه با طعم مرغ',
    discount: '۲۵٪ تخفیف',
    previousPrice: '۱۲۰٬۰۰۰',
    currentPrice: '۹۰٬۰۰۰',
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
