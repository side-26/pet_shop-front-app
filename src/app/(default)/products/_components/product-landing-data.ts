import { Bird, Bone, Cat, Dog, PackageCheck, Rabbit, ShieldCheck, Sparkles } from 'lucide-react';

export const productCategories = [
  {
    title: 'برای سگ‌ها',
    description: 'غذا، تشویقی و بازی',
    image: '/images/home/category-dog.jpg',
    imageAlt: 'توله گلدن رتریور در فضای سبز',
    icon: Dog,
    tone: 'tw:bg-primary-muted tw:text-primary-muted-foreground',
  },
  {
    title: 'برای گربه‌ها',
    description: 'غذا، خاک و مراقبت',
    image: '/images/home/category-cat.jpg',
    imageAlt: 'گربه پرشین سفید روی بالشت مخملی',
    icon: Cat,
    tone: 'tw:bg-secondary-muted tw:text-secondary-muted-foreground',
  },
  {
    title: 'برای پرندگان',
    description: 'دان، ویتامین و سرگرمی',
    image: '/images/home/category-bird.jpg',
    imageAlt: 'طوطی ماکائوی رنگارنگ روی استند چوبی',
    icon: Bird,
    tone: 'tw:bg-info-muted tw:text-info-muted-foreground',
  },
  {
    title: 'برای کوچولوها',
    description: 'خوراک، بستر و خانه',
    image: '/images/home/category-hamster.jpg',
    imageAlt: 'همستر کوچک در حال خوردن دانه',
    icon: Rabbit,
    tone: 'tw:bg-warning-muted tw:text-warning-muted-foreground',
  },
] as const;

export const landingProducts = [
  {
    title: 'غذای خشک سگ پرشین',
    description: 'فرمول کامل برای سگ‌های بالغ',
    image: '/images/home/product-dog-food.jpg',
    imageAlt: 'بسته غذای خشک سگ پرشین پت هیون',
    badge: 'پرفروش',
    badgeColor: 'primary' as const,
    price: '۹۶۰٬۰۰۰',
  },
  {
    title: 'خاک گربه کربن‌دار',
    description: 'جذب بالا و کنترل بوی طولانی',
    image: '/images/home/product-cat-litter.jpg',
    imageAlt: 'بسته خاک گربه با طراحی روشن',
    badge: '۱۵٪ تخفیف',
    badgeColor: 'error' as const,
    price: '۲۹۷٬۵۰۰',
  },
  {
    title: 'آب‌خوری هوشمند',
    description: 'پمپ کم‌صدا و فیلتر چندلایه',
    image: '/images/home/product-water-fountain.jpg',
    imageAlt: 'آب‌خوری هوشمند سفید حیوانات خانگی',
    badge: 'انتخاب ویژه',
    badgeColor: 'info' as const,
    price: '۱٬۷۵۰٬۰۰۰',
  },
  {
    title: 'پک اسباب‌بازی دندانی',
    description: 'طناب مقاوم برای بازی روزانه',
    image: '/images/home/product-rope-toys.jpg',
    imageAlt: 'مجموعه اسباب‌بازی طنابی رنگی سگ',
    badge: 'محبوب',
    badgeColor: 'secondary' as const,
    price: '۴۰۵٬۰۰۰',
  },
] as const;

export const shoppingPromises = [
  {
    title: 'انتخاب مطمئن',
    description: 'محصولات باکیفیت و مناسب نیاز واقعی پت شما',
    icon: ShieldCheck,
  },
  {
    title: 'بسته‌بندی امن',
    description: 'ارسال بهداشتی و محافظت‌شده تا درِ خانه',
    icon: PackageCheck,
  },
  {
    title: 'تجربه دوست‌داشتنی',
    description: 'خرید ساده، سریع و بدون سردرگمی برای شما',
    icon: Sparkles,
  },
] as const;

export const careSteps = [
  {
    number: '۰۱',
    title: 'نیاز پت را بشناس',
    description: 'سن، نژاد و سبک زندگی را در انتخاب در نظر بگیر.',
    icon: Bone,
  },
  {
    number: '۰۲',
    title: 'محصول مناسب را پیدا کن',
    description: 'از میان انتخاب‌های مرتب‌شده و مطمئن مقایسه کن.',
    icon: Sparkles,
  },
  {
    number: '۰۳',
    title: 'آسان تحویل بگیر',
    description: 'سفارش سنگین و سبک را امن، یکجا و سریع دریافت کن.',
    icon: PackageCheck,
  },
] as const;
