import type { ProfileOrderDTO } from './profile.dto';

export const profilePaymentStatusLabels = {
  pending: 'در انتظار پرداخت',
  paid: 'پرداخت شده',
  failed: 'پرداخت ناموفق',
} as const satisfies Record<ProfileOrderDTO['paymentStatus'], string>;

export const unknownProfilePaymentStatusLabel = 'وضعیت پرداخت نامشخص';
