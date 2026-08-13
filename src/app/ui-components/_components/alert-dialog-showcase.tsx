import { AlertTriangle, CircleHelp, Trash2 } from 'lucide-react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
  type AlertDialogContentProps,
} from '@/components/ui/alert-dialog';
import { Button, type ButtonProps } from '@/components/ui/button';

import { ShowcaseSection } from './showcase-section';

const dialogs = [
  {
    size: 'sm',
    label: 'کوچک',
    title: 'اعلان‌ها پاک شوند؟',
    description: 'همه اعلان‌های خوانده‌شده از این دستگاه حذف می‌شوند.',
    action: 'پاک کردن',
    color: 'warning',
    Icon: AlertTriangle,
  },
  {
    size: 'md',
    label: 'متوسط',
    title: 'نشانی اصلی تغییر کند؟',
    description: 'سفارش‌های بعدی به نشانی جدید ارسال خواهند شد.',
    action: 'تأیید تغییر',
    color: 'primary',
    Icon: CircleHelp,
  },
  {
    size: 'lg',
    label: 'بزرگ',
    title: 'حساب حیوان حذف شود؟',
    description:
      'سوابق سلامت و یادآوری‌های این حیوان برای همیشه حذف می‌شوند و قابل بازیابی نیستند.',
    action: 'حذف دائمی',
    color: 'error',
    Icon: Trash2,
  },
] as const satisfies ReadonlyArray<{
  size: NonNullable<AlertDialogContentProps['size']>;
  label: string;
  title: string;
  description: string;
  action: string;
  color: NonNullable<ButtonProps['color']>;
  Icon: typeof AlertTriangle;
}>;

export function AlertDialogShowcase() {
  return (
    <ShowcaseSection
      id="alert-dialogs"
      title="Alert Dialog"
      description="گفت‌وگوهای تأیید مودال با اندازه‌ها و نیت‌های معنایی متفاوت، مدیریت فوکوس و پشتیبانی Escape."
    >
      <div className="tw:flex tw:flex-wrap tw:gap-3">
        {dialogs.map(({ size, label, title, description, action, color, Icon }) => (
          <AlertDialog key={size}>
            <AlertDialogTrigger render={<Button variant="outlined" color={color} />}>
              نمایش گفت‌وگوی {label}
            </AlertDialogTrigger>
            <AlertDialogContent size={size}>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <Icon />
                </AlertDialogMedia>
                <AlertDialogTitle>{title}</AlertDialogTitle>
                <AlertDialogDescription>{description}</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>انصراف</AlertDialogCancel>
                <AlertDialogAction color={color}>{action}</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>

      <p className="tw:text-body-s tw:text-muted-foreground">
        هر نمونه عنوان و توضیح دسترس‌پذیر دارد. دکمه انصراف گفت‌وگو را می‌بندد و فوکوس را به محرک
        بازمی‌گرداند.
      </p>
    </ShowcaseSection>
  );
}
