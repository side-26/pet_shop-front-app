import { setLocale, type MessageParams } from 'yup';

const labels = {
  activityLevel: 'سطح فعالیت',
  ageAverage: 'میانگین سن',
  category: 'دسته‌بندی',
  confirmPassword: 'تکرار کلمه عبور',
  country: 'کشور مبدأ',
  description: 'توضیحات',
  email: 'ایمیل',
  enable: 'وضعیت فعال بودن',
  fullName: 'نام کامل',
  firstName: 'نام',
  id: 'شناسه',
  includeDisabled: 'نمایش موارد غیرفعال',
  isEnable: 'وضعیت فعال بودن',
  label: 'عنوان ویژگی',
  lastName: 'نام خانوادگی',
  limit: 'تعداد در صفحه',
  mainImage: 'تصویر اصلی',
  name: 'نام',
  nationalCode: 'کد ملی',
  newPassword: 'کلمه عبور',
  oldPassword: 'کلمه عبور فعلی',
  'otp-code': 'کد تأیید',
  page: 'شماره صفحه',
  password: 'کلمه عبور',
  petName: 'نام حیوان',
  petType: 'نوع حیوان',
  phoneNumber: 'شماره موبایل',
  propertyDefinitions: 'ویژگی‌ها',
  rememberMe: 'مرا به خاطر بسپار',
  'reset-password': 'درخواست بازیابی کلمه عبور',
  role: 'نقش کاربر',
  repeatPassword: 'تکرار کلمه عبور',
  search: 'جست‌وجو',
  size: 'اندازه',
  sort: 'مرتب‌سازی',
  title: 'عنوان',
  avatar: 'تصویر پروفایل',
  value: 'مقدار ویژگی',
  verificationCode: 'کد تأیید',
} as const;

const messages = {
  invalidIranianPhoneNumber: 'شماره موبایل باید با ۰۹ شروع شود و ۱۱ رقم باشد.',
  invalidOtpCode: 'کد تأیید باید ۶ رقم باشد.',
  passwordConfirmationMismatch: 'تکرار کلمه عبور با کلمه عبور جدید یکسان نیست.',
  userPasswordConfirmationMismatch: 'تکرار کلمه عبور با کلمه عبور یکسان نیست.',
  resetPasswordRequestRequired: 'درخواست تأیید باید برای بازیابی کلمه عبور باشد.',
  imageRequired: 'تصویر اصلی الزامی است.',
  petTypeImageRequired: 'تصویر اصلی نوع حیوان الزامی است.',
  imageType: 'فرمت تصویر باید JPEG، PNG یا WebP باشد.',
  imageSize: 'حجم تصویر نمی‌تواند بیشتر از ۱ مگابایت باشد.',
  breedImageSize: 'حجم تصویر باید حداکثر ۱ مگابایت باشد.',
  propertyValue: 'مقدار ویژگی باید متنِ غیرخالی یا عدد معتبر باشد.',
  petTypePropertyValue: 'مقدار مشخصات باید متنِ غیرخالی یا عدد معتبر باشد.',
} as const;

export const yupLocalizationDictionary = { labels, messages } as const;

type LabelKey = keyof typeof labels;
type MessageKey = keyof typeof messages;

function pathKey(path: string): string {
  const pathParts = path.split(/[.[\]]/).filter((part) => part && !/^\d+$/.test(part));
  return pathParts.at(-1) ?? path;
}

function localizedField({ label, path }: Pick<MessageParams, 'label' | 'path'>): string {
  if (label) return label;
  const key = pathKey(path) as LabelKey;
  return labels[key] ?? path;
}

function toPersianNumber(value: unknown) {
  return String(value).replace(/\d/g, (digit) => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)]);
}

export function yupLabel(key: LabelKey): string {
  return labels[key];
}

export function yupMessage(key: MessageKey): string {
  return messages[key];
}

setLocale({
  mixed: {
    default: (params) => `${localizedField(params)} معتبر نیست.`,
    defined: (params) => `${localizedField(params)} باید مقدار داشته باشد.`,
    notNull: (params) => `${localizedField(params)} نمی‌تواند خالی باشد.`,
    notType: (params) => `${localizedField(params)} نوع معتبری ندارد.`,
    oneOf: (params) => `${localizedField(params)} یکی از مقادیر مجاز نیست.`,
    required: (params) => `${localizedField(params)} الزامی است.`,
  },
  string: {
    email: (params) => `${localizedField(params)} معتبر نیست.`,
    length: (params) =>
      `${localizedField(params)} باید دقیقاً ${toPersianNumber(params.length)} نویسه باشد.`,
    matches: (params) => `${localizedField(params)} قالب معتبری ندارد.`,
    max: (params) =>
      `${localizedField(params)} نمی‌تواند بیشتر از ${toPersianNumber(params.max)} نویسه باشد.`,
    min: (params) =>
      `${localizedField(params)} باید حداقل ${toPersianNumber(params.min)} نویسه باشد.`,
  },
  number: {
    integer: (params) => `${localizedField(params)} باید عدد صحیح باشد.`,
    max: (params) => `${localizedField(params)} باید حداکثر ${toPersianNumber(params.max)} باشد.`,
    min: (params) => `${localizedField(params)} باید حداقل ${toPersianNumber(params.min)} باشد.`,
  },
  array: {
    max: (params) =>
      `${localizedField(params)} نمی‌تواند بیشتر از ${toPersianNumber(params.max)} مورد داشته باشد.`,
    min: (params) =>
      `${localizedField(params)} باید حداقل ${toPersianNumber(params.min)} مورد داشته باشد.`,
  },
});
