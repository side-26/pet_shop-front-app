import { AlertCircle, CheckCircle2, Clock3 } from 'lucide-react';

import { Badge, type BadgeProps } from '@/components/ui/badge';
import {
  profilePaymentStatusLabels,
  unknownProfilePaymentStatusLabel,
} from '@/entities/profile/profile.constant';
import type { ProfileOrderDTO } from '@/entities/profile/profile.dto';

const paymentStates: Record<
  ProfileOrderDTO['paymentStatus'],
  { color: NonNullable<BadgeProps['color']>; icon: typeof Clock3 }
> = {
  pending: { color: 'warning', icon: Clock3 },
  paid: { color: 'success', icon: CheckCircle2 },
  failed: { color: 'error', icon: AlertCircle },
};
const unknownPaymentState = {
  color: 'neutral' as NonNullable<BadgeProps['color']>,
  icon: Clock3,
};

export function OrderPaymentStatusBadge({ order }: Readonly<{ order: ProfileOrderDTO }>) {
  const appearance = paymentStates[order.paymentStatus] ?? unknownPaymentState;
  const Icon = appearance.icon;
  const label = profilePaymentStatusLabels[order.paymentStatus] ?? unknownProfilePaymentStatusLabel;

  return (
    <Badge variant="tonal" color={appearance.color} size="lg">
      <Icon aria-hidden="true" />
      {label}
    </Badge>
  );
}
