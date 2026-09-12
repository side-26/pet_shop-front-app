import { Bone, PackageCheck, ShieldCheck, Sparkles } from 'lucide-react';

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
